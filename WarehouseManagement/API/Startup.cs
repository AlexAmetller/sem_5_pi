using System.Security.Cryptography;
using System.Text;
using Application;
using Infrastructure;
using Infrastructure.Shared;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace API
{
public sealed class Startup
{

    private readonly string CorsPolicy = "AllowOrigins";

    public IConfiguration Configuration { get; }

    public IWebHostEnvironment Environment { get; }

    public Startup(IConfiguration configuration, IWebHostEnvironment environment)
    {
        Configuration = configuration;
        Environment = environment;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplication();
        services.AddInfrastructure(Configuration);
        services.AddControllers();
        services.AddSwaggerGen(
            c =>
            {
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
                    Description = @"JWT Authorization header using the Bearer scheme. \r\n\r\n
                      Enter 'Bearer' [space] and then your token in the text input below.
                      \r\n\r\nExample: 'Bearer 12345abcdef'",
                    Name = "Authorization", In = ParameterLocation.Header, Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement() {
                    { new OpenApiSecurityScheme {
                         Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
                         Scheme = "oauth2",
                         Name = "Bearer",
                         In = ParameterLocation.Header,

                     },
                      new List<string>() }
                });
            });
        services.AddRouting(options => options.LowercaseUrls = true);
        services.AddCors(options =>
                             options.AddPolicy(CorsPolicy, policy => policy
                                                                         /* .AllowAnyOrigin() */
                                                                         .AllowAnyMethod()
                                                                         .AllowAnyHeader()
                                                                         .SetIsOriginAllowed(isOriginAllowed: _ => true)
                                                                         .AllowCredentials()));

        services.AddSingleton<ECDsaSecurityKey>(
            provider =>
            {
                var ecd = ECDsa.Create();
                ecd.ImportSubjectPublicKeyInfo(source: Convert.FromBase64String(Configuration["Jwt:PublicKey"]),
                                               bytesRead: out int _);

                return new ECDsaSecurityKey(ecd);
            });
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(
                JwtBearerDefaults.AuthenticationScheme,
                options =>
                {
                    var ecd = services.BuildServiceProvider().GetRequiredService<ECDsaSecurityKey>();

                    options.IncludeErrorDetails = true; // <- great for debugging
                    options.TokenValidationParameters =
                        new TokenValidationParameters { IssuerSigningKey = ecd,       ValidateIssuer = false,
                                                        ValidateAudience = false,     ValidateLifetime = true,
                                                        RequireExpirationTime = true, ValidateIssuerSigningKey = true };
                });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, EletricGoDbContext dataContext)
    {
        app.UseSwagger();
        app.UseSwaggerUI(options =>
                         {
                             options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
                             options.RoutePrefix = string.Empty;
                         });
        app.UseCors(CorsPolicy);
        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseEndpoints(endpoints => endpoints.MapControllers().RequireAuthorization());
        dataContext.Database.Migrate();
    }
}
}

import { Navigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import Form, { TextInput } from '../components/Form'
import { useForm } from 'react-hook-form'
import { useLogin } from '../services/auth'
import { toast } from 'react-toastify'
import useAuth from '../hooks/auth'
import Button from '../components/Button'
import Header from '../components/Header'
import { Login, zLogin } from '../types/auth'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'

export default function LoginPage() {
  const [showPolicyModal, setshowPolicyModal] = useState(false)
  const { mutateAsync: login, isLoading } = useLogin()
  const { setToken, user } = useAuth()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<Login>({
    resolver: zodResolver(zLogin),
  })

  const hasErrors = Boolean(
    errors.mail || (errors.password && errors.password.type !== 'custom')
  )

  if (user) return <Navigate to="/dashboard" />

  const onSubmit = (form: Login | CredentialResponse) => {
    toast.promise(() => login(form), {
      pending: 'Logging in...',
      success: {
        render(response) {
          const token = response.data?.token
          const refresh = response.data?.refresh
          if (token && refresh) setToken(token, refresh)
          return 'Success!'
        },
      },
      error: {
        render(err) {
          setError('password', {
            type: 'custom',
            message: 'Invalid credentials.',
          })
          return `${err.data}`
        },
      },
    })
  }

  const onError = (message: string) => {
    toast.error(message)
  }

  return (
    <div
      className={`h-screen w-screen bg-gradient-to-r from-purple-500 to-pink-500
                  flex justify-center items-center`}
    >
      {showPolicyModal && (
        <PolicyModal close={() => setshowPolicyModal(false)} />
      )}
      {!showPolicyModal && (
        <Form
          onSubmit={handleSubmit(
            (form) => onSubmit(form),
            () => onError('Invalid credentials.')
          )}
          className="p-9 max-w-xs gap-0"
        >
          <div className="flex justify-center mb-5">
            <Header title={'ElectricGo Log In'} />
          </div>
          <div className="w-full mb-6">
            <TextInput
              disabled={isLoading}
              {...register('mail')}
              placeholder="user@email.com"
            />
          </div>
          <div className="w-full mb-3">
            <TextInput
              disabled={isLoading}
              {...register('password')}
              type="password"
              placeholder="Password"
            />
          </div>
          <div className="mx-auto h-5 mb-3 text-red-500 font-thin">
            {errors.mail?.message ?? errors.password?.message}
          </div>
          <Button
            type="submit"
            className="w-full justify-center"
            disabled={!isDirty || hasErrors || isLoading}
          >
            Sign in
          </Button>
          <div className="w-full mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={onSubmit}
              onError={() => onError('Google login failed.')}
              shape="square"
              size="large"
              width="248px"
            />
          </div>
          <div
            className="mt-4 cursor-pointer flex justify-center text-sky-900
          font-normal"
            onClick={() => setshowPolicyModal(true)}
          >
            ElectricGo's Privacy Policy
          </div>
        </Form>
      )}
    </div>
  )
}

function PolicyModal({ close }: { close: () => void }) {
  return (
    <div className="font-light text-base absolute max-w-full w-[768px] h-screen max-h-full px-3 py-6 left-1/2 -translate-x-1/2">
      <div className="bg-white rounded-xl shadow-xl p-6 h-full w-full">
        <div
          className="overflow-y-scroll h-full w-full text-justify relative
          p-4"
        >
          <button className="absolute right-6" onClick={close}>
            <CloseIcon />
          </button>
          <span className="font-medium text-lg block pb-3">
            Política de Privacidade
          </span>
          Política de Privacidade A confidencialidade e a integridade dos seus
          dados pessoais são uma preocupação da EletricAcme S.A. A EletricAcme
          S.A. cumpre a legislação de proteção de dados pessoais em vigor,
          nomeadamente nas relações com os seus utilizadores, fornecedores e
          subcontratados, em particular o Regulamento (UE) 2016/679 do
          Parlamento Europeu e do Conselho, de 27 de Abril de 2016
          (“Regulamento” ou “RGPD”).
          <br />
          <br />A EletricAcme S.A. compreende e aceita que a utilização dos seus
          dados pessoais que, no presente caso, se circunscrevem unicamente
          àqueles que são necessários à concretização do registo pessoal e
          requer a sua prévia autorização. <br />
          <br />A EletricAcme S.A. é responsável pelo tratamento dos seus dados
          pessoais que nos sejam disponibilizados no âmbito das transações
          comerciais realizadas na aplicação. <br />
          <br />A EletricAcme S.A. e os seus prestadores de serviços na área da
          gestão e armazenamento de dados, utilizam uma diversidade de medidas
          de segurança, incluindo encriptação e ferramentas de autenticação,
          para ajudar a proteger e manter a segurança dos seus dados pessoais em
          conformidade com os requisitos de proteção de dados aplicáveis. Os
          dados que são disponibilizados à EletricAcme S.A. apenas podem ser
          acedidos por pessoal restrito com base na “necessidade de conhecer” e
          apenas no âmbito das finalidades aqui comunicadas. <br />
          <br />A transferência de dados recolhidos é feita sempre de forma
          encriptada. Os dados disponibilizados à EletricAcme S.A. serão usados
          unicamente durante o período de tempo necessário à finalidade para a
          qual foram disponibilizados, após o que serão destruídos de forma
          segura, salvo se, durante esse período, não tenha já retirado o seu
          consentimento.
          <br />
          <br /> Os seus dados pessoais aqui fornecidos, salvo a sua autorização
          expressa em contrário, não serão transmitidos a terceiros. Pode, em
          qualquer altura, alterar ou retirar o seu consentimento à utilização
          pela EletricAcme S.A. dos seus dados pessoais aqui transmitidos, com
          efeitos para o futuro. Ao fazê-lo, os seus dados serão apagados de
          forma segura. <br />
          <br />
          Para alterar ou retirar o seu consentimento dos dados fornecidos à
          EletricAcme S.A. deverá contactar o Encarregado da Proteção de Dados
          da EletricAcme S.A. através do endereço de email
          franciscooliveiraea@hotmail.com.
        </div>
      </div>
    </div>
  )
}

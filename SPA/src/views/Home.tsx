import Header from '../components/Header'

export default function Home() {
  return (
    <div>
      <Header title={'Dashboard'} />
      <small className="text-sm">
        This is the single page application used for managing entities within
        the context of the <b>ElectricGo</b> project.
      </small>
    </div>
  )
}

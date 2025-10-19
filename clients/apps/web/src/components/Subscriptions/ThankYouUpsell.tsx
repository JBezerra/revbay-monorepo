import {
  CreditCardIcon,
  ListBulletIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline'
import Button from '@polar-sh/ui/components/atoms/Button'
import Image from 'next/image'
import WhiteCard from '../Cards/WhiteCard'
import GitHubIcon from '../Icons/GitHubIcon'
import screenshot from '../Pledge/dashboard.png'

const ThankYouUpsell = (props: {
  onEmailSignin: () => void
  emailSigninLoading: boolean
}) => {
  const { onEmailSignin, emailSigninLoading } = props
  return (
    <>
      <WhiteCard
        className="mt-11 flex flex-row overflow-hidden"
        padding={false}
      >
        <div className="flex w-full flex-col space-y-4 p-5 md:w-2/5 md:p-6">
          <h2 className="text-xl">
            Bem-vindo! Você agora tem uma conta com Polar 🎉
          </h2>
          <p className="dark:text-polar-400 text-sm font-normal text-gray-500">
            Faça login a qualquer momento no futuro solicitando um link mágico
            para sua inbox.
          </p>

          <ul>
            <li className="flex flex-row items-center space-x-2">
              <PlusCircleIcon
                height={18}
                width={18}
                className="text-blue-500"
              />

              <div className="text-sm">Registrar qualquer problema</div>
            </li>

            <li className="mt-3 flex flex-row items-center space-x-2">
              <ListBulletIcon
                height={18}
                width={18}
                className="text-blue-500"
              />

              <div className="text-sm">
                Acompanhar o progresso de problemas registrados
              </div>
            </li>

            <li className="mb-2 mt-3 flex flex-row items-center space-x-2">
              <CreditCardIcon
                height={18}
                width={18}
                className="text-blue-500"
              />
              <div className="text-sm">Salvar método de pagamento</div>
            </li>

            <li className="mb-2 mt-3 flex flex-row items-center space-x-2">
              <GitHubIcon height={18} width={18} className="text-blue-500" />
              <div className="text-sm">Connect GitHub account for more</div>
            </li>
          </ul>
          <Button
            type="button"
            size="lg"
            disabled={emailSigninLoading}
            loading={emailSigninLoading}
            onClick={onEmailSignin}
          >
            Fazer login com email
          </Button>
        </div>
        <div className="bg-grid-pattern dark:bg-grid-pattern-dark relative hidden w-3/5 overflow-hidden border-l border-blue-100 bg-blue-50 md:block dark:border-blue-500/20 dark:bg-blue-500/20">
          <Image
            src={screenshot}
            alt="Polar dashboard screenshot"
            priority={true}
            className="absolute w-full"
          />
        </div>
      </WhiteCard>
    </>
  )
}

export default ThankYouUpsell

import { schemas } from '@polar-sh/client'
import ShadowBox from '@polar-sh/ui/components/atoms/ShadowBox'
import LogoIcon from '../Brand/LogoIcon'
import Login from './Login'

interface AuthModalProps {
  returnTo?: string
  returnParams?: Record<string, string>
  signup?: schemas['UserSignupAttribution']
}

export const AuthModal = ({
  returnTo,
  returnParams,
  signup,
}: AuthModalProps) => {
  const isSignup = signup !== undefined
  const title = isSignup ? 'Cadastrar-se' : 'Entrar'

  // TODO: mexer nessa copy
  const copy = isSignup ? (
    <p className="dark:text-polar-500 text-xl text-gray-500">
      Junte-se a milhares de desenvolvedores e startups que monetizam seus
      produtos com a TropicPay.
    </p>
  ) : null

  return (
    <ShadowBox className="overflow-y-auto p-12">
      <div className="flex flex-col justify-between gap-y-8">
        <LogoIcon className="text-black dark:text-white" size={60} />

        <div className="flex flex-col gap-y-4">
          <h1 className="text-3xl">{title}</h1>
          {copy}
        </div>

        <div className="flex flex-col gap-y-12">
          <Login
            returnTo={returnTo}
            returnParams={returnParams}
            signup={signup}
          />
        </div>
      </div>
    </ShadowBox>
  )
}

import { OrganizationContext } from '@/providers/maintainerOrganization'
import { ArrowOutwardOutlined } from '@mui/icons-material'
import { schemas } from '@polar-sh/client'
import Button from '@polar-sh/ui/components/atoms/Button'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import LogoIcon from '../Brand/LogoIcon'
import NextJsIcon from '../Icons/frameworks/nextjs'
import NodeJsIcon from '../Icons/frameworks/nodejs'
import OrganizationAccessTokensSettings from '../Settings/OrganizationAccessTokensSettings'
import {
  SyntaxHighlighterClient,
  SyntaxHighlighterProvider,
} from '../SyntaxHighlighterShiki/SyntaxHighlighterClient'

const frameworks = (product: schemas['Product']) =>
  [
    {
      slug: 'nextjs',
      name: 'Next.js',
      link: 'https://docs.polar.sh/integrate/sdk/adapters/nextjs',
      icon: <NextJsIcon size={24} />,
      install: 'pnpm add @polar-sh/nextjs',
      code: `import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  successUrl: process.env.POLAR_SUCCESS_URL
});`,
    },
    {
      slug: 'nodejs',
      name: 'Node.js',
      link: 'https://docs.polar.sh/integrate/sdk/typescript',
      icon: <NodeJsIcon size={24} />,
      install: 'pnpm add @polar-sh/sdk',
      code: `import { Polar } from "@polar-sh/sdk";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
});

const checkout = await polar.checkouts.create({
  products: ["${product.id}"],
  successUrl: process.env.POLAR_SUCCESS_URL
});

redirect(checkout.url)`,
    },
  ] as const

export interface IntegrateStepProps {
  product: schemas['Product']
}

export const IntegrateStep = ({ product }: IntegrateStepProps) => {
  const [selectedFramework, setSelectedFramework] = useState<string | null>(
    'nextjs',
  )

  const { organization } = useContext(OrganizationContext)

  const currentFramework = frameworks(product).find(
    (framework) => framework.slug === selectedFramework,
  )

  return (
    <div className="flex h-full flex-col md:flex-row">
      <div className="flex h-full min-h-0 w-full flex-col gap-12 overflow-y-auto p-12 md:max-w-lg">
        <div className="flex flex-col gap-y-12">
          <LogoIcon size={50} />
          <div className="flex flex-col gap-y-4">
            <h1 className="text-3xl">Integrar Checkout</h1>
            <p className="dark:text-polar-400 text-lg text-gray-600">
              Integre checkouts com seu framework favorito.
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={twMerge(
                'dark:bg-polar-700 flex h-2 flex-1 rounded-full bg-gray-300',
                index < 3 && 'bg-black dark:bg-white',
              )}
            />
          ))}
        </div>
        <div className="hidden flex-col gap-y-6 md:flex">
          <div className="grid grid-cols-2 gap-4">
            {frameworks(product).map((framework) => (
              <FrameworkCard
                key={framework.slug}
                {...framework}
                active={selectedFramework === framework.slug}
                onClick={() => setSelectedFramework(framework.slug)}
              />
            ))}
          </div>
          <Link
            href={`https://docs.polar.sh/integrate/sdk/adapters/nextjs`}
            target="_blank"
            className="w-full"
          ></Link>
        </div>
        <Link href={`/dashboard/${organization.slug}`} className="w-full">
          <Button size="lg" fullWidth>
            Ir para Dashboard
          </Button>
        </Link>
      </div>
      <SyntaxHighlighterProvider>
        <div className="dark:bg-polar-800 hidden flex-1 flex-grow flex-col items-center gap-12 overflow-y-auto bg-gray-100 p-16 md:flex">
          <div className="dark:bg-polar-900 flex w-full max-w-3xl flex-col gap-y-12 rounded-3xl bg-white p-12">
            <div className="flex flex-col items-center gap-y-6 text-center">
              <LogoIcon size={40} />
              <div className="flex flex-col gap-y-4">
                <h1 className="text-3xl">Integrar Checkout</h1>
                <p className="dark:text-polar-500 text-lg text-gray-500">
                  Siga as instruções abaixo para integrar o checkout em sua
                  aplicação.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-y-6">
              <h2 className="text-lg">1. Instalar Dependências</h2>
              <CodeWrapper>
                <SyntaxHighlighterClient
                  lang="bash"
                  code={
                    frameworks(product).find(
                      (framework) => framework.slug === selectedFramework,
                    )?.install ?? ''
                  }
                />
              </CodeWrapper>
            </div>

            <div className="flex flex-col gap-y-6">
              <h2 className="text-lg">2. Adicionar Variáveis de Ambiente</h2>
              <OrganizationAccessTokensSettings organization={organization} />
              <CodeWrapper>
                <SyntaxHighlighterClient
                  lang="bash"
                  code={`# .env
POLAR_ACCESS_TOKEN=XXX
POLAR_SUCCESS_URL=https://my-app.com/success?checkout_id={CHECKOUT_ID}`}
                />
              </CodeWrapper>
            </div>

            <div className="flex flex-col gap-y-6">
              <h2 className="text-lg">3. Integrar o Checkout</h2>
              <CodeWrapper>
                <SyntaxHighlighterClient
                  lang={'typescript'}
                  code={currentFramework?.code ?? ''}
                />
              </CodeWrapper>
              <Link href={currentFramework?.link ?? ''} target="_blank">
                <Button size="lg" variant="secondary" fullWidth>
                  {/* Todo: mudar link */}
                  <span>Ver Documentação</span>
                  <ArrowOutwardOutlined className="ml-2" fontSize="small" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SyntaxHighlighterProvider>
    </div>
  )
}

const CodeWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="dark:border-polar-700 dark:bg-polar-800 w-full rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm">
      {children}
    </div>
  )
}

export interface FrameworkCardProps {
  slug: string
  name: string
  icon?: React.ReactNode
  active: boolean
  onClick: (framework: string) => void
}

const FrameworkCard = ({
  name,
  slug,
  icon,
  active,
  onClick,
}: FrameworkCardProps) => {
  return (
    <div
      className={twMerge(
        'dark:bg-polar-800 dark:border-polar-700 flex flex-col gap-y-4 rounded-xl border border-transparent bg-gray-100 p-4',
        active
          ? 'shadow-3xl border-gray-100 bg-blue-500 text-white dark:bg-blue-500'
          : 'transition-opacity hover:opacity-70',
      )}
      role="button"
      onClick={() => onClick(slug)}
    >
      {icon ?? (
        <div className="dark:bg-polar-900 h-8 w-8 rounded-full bg-gray-200" />
      )}
      <h2 className="text-lg">{name}</h2>
    </div>
  )
}

import { useUpdateOrganization } from '@/hooks/queries'
import { setValidationErrors } from '@/utils/api/errors'
import {
  AddOutlined,
  AddPhotoAlternateOutlined,
  CloseOutlined,
  Facebook,
  GitHub,
  Instagram,
  LinkedIn,
  Public,
  X,
  YouTube,
} from '@mui/icons-material'
import { isValidationError, schemas } from '@polar-sh/client'
import Avatar from '@polar-sh/ui/components/atoms/Avatar'
import Button from '@polar-sh/ui/components/atoms/Button'
import CopyToClipboardInput from '@polar-sh/ui/components/atoms/CopyToClipboardInput'
import Input from '@polar-sh/ui/components/atoms/Input'
import MoneyInput from '@polar-sh/ui/components/atoms/MoneyInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@polar-sh/ui/components/atoms/Select'
import TextArea from '@polar-sh/ui/components/atoms/TextArea'
import { Checkbox } from '@polar-sh/ui/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from '@polar-sh/ui/components/ui/form'
import React, { useCallback } from 'react'
import { FileRejection } from 'react-dropzone'
import { useForm, useFormContext } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { FileObject, useFileUpload } from '../FileUpload'
import { toast } from '../Toast/use-toast'
import ConfirmationButton from '../ui/ConfirmationButton'
import {
  SettingsGroup,
  SettingsGroupActions,
  SettingsGroupItem,
} from './SettingsGroup'

interface OrganizationDetailsFormProps {
  organization: schemas['Organization']
  inKYCMode: boolean
}

const AcquisitionOptions = {
  website: 'Website & SEO',
  socials: 'Social media',
  sales: 'Sales',
  ads: 'Ads',
  email: 'Email marketing',
  other: 'Other',
}

const SwitchingFromOptions = {
  paddle: 'Paddle',
  lemon_squeezy: 'Lemon Squeezy',
  gumroad: 'Gumroad',
  stripe: 'Stripe',
  other: 'Other',
}

const SOCIAL_PLATFORM_DOMAINS = {
  'x.com': 'x',
  'twitter.com': 'x',
  'instagram.com': 'instagram',
  'facebook.com': 'facebook',
  'youtube.com': 'youtube',
  'linkedin.com': 'linkedin',
  'youtu.be': 'youtube',
  'github.com': 'github',
}

const OrganizationSocialLinks = () => {
  const { watch, setValue } = useFormContext<schemas['OrganizationUpdate']>()
  const socials = watch('socials') || []

  const getIcon = (platform: string, className: string) => {
    switch (platform) {
      case 'x':
        return <X className={className} />
      case 'instagram':
        return <Instagram className={className} />
      case 'facebook':
        return <Facebook className={className} />
      case 'github':
        return <GitHub className={className} />
      case 'youtube':
        return <YouTube className={className} />
      case 'linkedin':
        return <LinkedIn className={className} />
      default:
        return <Public className={className} />
    }
  }

  const handleAddSocial = () => {
    setValue('socials', [...socials, { platform: 'other', url: '' }], {
      shouldDirty: true,
    })
  }

  const handleRemoveSocial = (index: number) => {
    setValue(
      'socials',
      socials.filter((_, i) => i !== index),
      { shouldDirty: true },
    )
  }

  const handleChange = (index: number, value: string) => {
    if (!value) return

    // Add protocol if missing
    if (!value.startsWith('https://')) {
      value = 'https://' + value
    } else if (value.startsWith('http://')) {
      value = value.replace('http://', 'https://')
    }

    try {
      const url = new URL(value)
      const hostname = url.hostname as keyof typeof SOCIAL_PLATFORM_DOMAINS
      const newPlatform = (SOCIAL_PLATFORM_DOMAINS[hostname] ??
        'other') as schemas['OrganizationSocialPlatforms']

      const updatedSocials = [...socials]
      updatedSocials[index] = {
        platform: newPlatform,
        url: value,
      }
      setValue('socials', updatedSocials, { shouldDirty: true })
    } catch {}
  }

  return (
    <div className="space-y-3">
      {socials.map((social, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="flex w-5 justify-center">
            {getIcon(social.platform, 'text-gray-400 h-4 w-4')}
          </div>
          <Input
            value={social.url || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder="https://"
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveSocial(index)}
            className="text-gray-400 hover:text-gray-600"
          >
            <CloseOutlined fontSize="small" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={handleAddSocial}
      >
        <AddOutlined fontSize="small" className="mr-1" />
        Adicionar
      </Button>
    </div>
  )
}

const CompactTextArea = ({
  field,
  placeholder,
  rows = 3,
}: {
  field: any
  placeholder: string
  rows?: number
}) => (
  <TextArea
    {...field}
    rows={rows}
    placeholder={placeholder}
    className="resize-none"
  />
)

export const OrganizationDetailsForm: React.FC<
  OrganizationDetailsFormProps
> = ({ organization, inKYCMode }) => {
  const { control, watch, setError, setValue } =
    useFormContext<schemas['OrganizationUpdate']>()
  const name = watch('name')
  const avatarURL = watch('avatar_url')

  const onFilesUpdated = useCallback(
    (files: FileObject<schemas['OrganizationAvatarFileRead']>[]) => {
      if (files.length === 0) {
        return
      }
      const lastFile = files[files.length - 1]
      setValue('avatar_url', lastFile.public_url, { shouldDirty: true })
    },
    [setValue],
  )
  const onFilesRejected = useCallback(
    (rejections: FileRejection[]) => {
      rejections.forEach((rejection) => {
        setError('avatar_url', { message: rejection.errors[0].message })
      })
    },
    [setError],
  )
  const { getRootProps, getInputProps, isDragActive } = useFileUpload({
    organization: organization,
    service: 'organization_avatar',
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/webp': [],
      'image/svg+xml': [],
    },
    maxSize: 1 * 1024 * 1024,
    onFilesUpdated,
    onFilesRejected,
    initialFiles: [],
  })

  return (
    <div className="space-y-8">
      {/* Basic Info - Always Visible */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium">Logo</label>
            <div
              {...getRootProps()}
              className={twMerge(
                'relative cursor-pointer',
                isDragActive && 'opacity-50',
              )}
            >
              <input {...getInputProps()} />
              <Avatar
                avatar_url={avatarURL ?? ''}
                name={name ?? ''}
                className="h-16 w-16 transition-opacity hover:opacity-75"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100">
                <AddPhotoAlternateOutlined className="text-gray-600" />
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:col-span-10">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Nome da Organização *
              </label>
              <FormField
                control={control}
                name="name"
                rules={{ required: 'Nome da Organização é obrigatório' }}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder="Acme Inc."
                    />
                    <FormMessage />
                  </div>
                )}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email de Suporte *
              </label>
              <FormField
                control={control}
                name="email"
                rules={{ required: 'Email de Suporte é obrigatório' }}
                render={({ field }) => (
                  <div>
                    <Input
                      type="email"
                      {...field}
                      value={field.value || ''}
                      placeholder="suporte@acme.com"
                    />
                    <FormMessage />
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Website</label>
          <FormField
            control={control}
            name="website"
            render={({ field }) => (
              <div>
                <Input
                  type="url"
                  {...field}
                  value={field.value || ''}
                  placeholder="https://acme.com"
                />
                <FormMessage />
              </div>
            )}
          />
        </div>

        {/* Social Links - Progressive Disclosure */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium">Redes Sociais</label>
          </div>
          <OrganizationSocialLinks />
        </div>
      </div>

      {/* Business Details - KYC Mode Only */}
      {inKYCMode && (
        <div className="border-t pt-8">
          <div className="mb-6">
            <h3 className="mb-2 text-lg font-medium">Detalhes da Empresa</h3>
            <p className="text-sm text-gray-600">
              Ajude-nos a entender sua empresa para cumprir com as normas e
              configurar o pagamento.
            </p>
          </div>

          <div className="space-y-6">
            {/* <div>
              <label className="mb-2 block text-sm font-medium">
                Descreva sua empresa *
              </label>
              <p className="mb-2 text-xs text-gray-600">
                Nos diga: em que indústria você está, qual problema você resolve,
                e quem são seus clientes
              </p>
              <FormField
                control={control}
                name="details.about"
                rules={{
                  required: 'Por favor, descreva sua empresa',
                  minLength: {
                    value: 50,
                    message: 'Por favor, forneça pelo menos 50 caracteres',
                  },
                }}
                render={({ field }) => (
                  <div>
                    <CompactTextArea
                      field={field}
                      placeholder="Nós fazemos software de gerenciamento de projetos para times de design."
                    />
                    <div className="mt-1 flex items-center justify-between">
                      <FormMessage />
                      <span className="text-xs text-gray-500">
                        {field.value?.length || 0}/50+ caracteres
                      </span>
                    </div>
                  </div>
                )}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                O que você vende? Inclua o tipo e as funcionalidades que são concedidas
              </label>
              <p className="mb-2 text-xs text-gray-600">
                Nos diga: tipo de produto (SaaS, curso, serviço, etc.) e principais
                features (relatório avançado, colaboração em equipe, etc.)
              </p>
              <FormField
                control={control}
                name="details.product_description"
                rules={{
                  required: 'Por favor, descreva o que você vende',
                  minLength: {
                    value: 50,
                    message: 'Por favor, forneça pelo menos 50 caracteres',
                  },
                }}
                render={({ field }) => (
                  <div>
                    <CompactTextArea
                      field={field}
                      placeholder="Software de gerenciamento de projetos com colaboração em equipe, compartilhamento de arquivos, e relatório. $29/mês por usuário."
                    />
                    <div className="mt-1 flex items-center justify-between">
                      <FormMessage />
                      <span className="text-xs text-gray-500">
                        {field.value?.length || 0}/50+ caracteres
                      </span>
                    </div>
                  </div>
                )}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Como você vai integrar o Polar em sua empresa? *
              </label>
              <p className="mb-2 text-xs text-gray-600">
                Nos diga: onde os clientes verão o Polar, quais funcionalidades
                you&apos;ll use, and how it fits your workflow
              </p>
              <FormField
                control={control}
                name="details.intended_use"
                rules={{
                  required: 'Por favor, descreva como você vai usar o Polar',
                  minLength: {
                    value: 30,
                    message: 'Por favor, forneça pelo menos 30 caracteres',
                  },
                }}
                render={({ field }) => (
                  <div>
                    <CompactTextArea
                      field={field}
                      placeholder="Checkout em nosso website, API para faturamento de assinaturas, webhooks para acesso de usuários"
                    />
                    <div className="mt-1 flex items-center justify-between">
                      <FormMessage />
                      <span className="text-xs text-gray-500">
                        {field.value?.length || 0}/30+ caracteres
                      </span>
                    </div>
                  </div>
                )}
              />
            </div> */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Principais canais de aquisição de clientes *
              </label>
              <FormField
                control={control}
                name="details.customer_acquisition"
                rules={{
                  required:
                    'Por favor, selecione pelo menos um canal de aquisição de clientes',
                  validate: (value) =>
                    (value && value.length > 0) ||
                    'Por favor, selecione pelo menos um canal de aquisição de clientes',
                }}
                render={({ field }) => (
                  <div>
                    <div className="space-y-2">
                      {Object.entries(AcquisitionOptions).map(
                        ([key, label]) => (
                          <label
                            key={key}
                            className="flex cursor-pointer items-center gap-2"
                          >
                            <Checkbox
                              checked={field.value?.includes(key) || false}
                              onCheckedChange={(checked) => {
                                const current = field.value || []
                                if (checked) {
                                  field.onChange([...current, key])
                                } else {
                                  field.onChange(
                                    current.filter((v) => v !== key),
                                  )
                                }
                              }}
                            />
                            <span className="text-sm">{label}</span>
                          </label>
                        ),
                      )}
                    </div>
                    <FormMessage className="mt-2" />
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Receita anual esperada
                </label>
                <FormField
                  control={control}
                  name="details.future_annual_revenue"
                  render={({ field }) => (
                    <div>
                      <MoneyInput
                        {...field}
                        placeholder={50000}
                        className="w-full"
                      />
                      <FormMessage />
                    </div>
                  )}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Atualmente usando
                </label>
                <FormField
                  control={control}
                  name="details.switching_from"
                  render={({ field }) => (
                    <div>
                      <Select
                        value={field.value || 'none'}
                        onValueChange={(value) => {
                          field.onChange(value === 'none' ? undefined : value)
                          setValue('details.switching', value !== 'none', {
                            shouldDirty: true,
                          })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma plataforma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            Este é o meu primeiro pagamento
                          </SelectItem>
                          {Object.entries(SwitchingFromOptions).map(
                            ([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface OrganizationProfileSettingsProps {
  organization: schemas['Organization']
  kyc?: boolean
  onSubmitted?: () => void
}

const OrganizationProfileSettings: React.FC<
  OrganizationProfileSettingsProps
> = ({ organization, kyc, onSubmitted }) => {
  const form = useForm<schemas['OrganizationUpdate']>({
    defaultValues: organization,
  })
  const { handleSubmit, setError, formState, reset } = form
  const inKYCMode = kyc === true

  const updateOrganization = useUpdateOrganization()

  const onSubmit = async (body: schemas['OrganizationUpdate']) => {
    const { data, error } = await updateOrganization.mutateAsync({
      id: organization.id,
      body,
    })

    if (error) {
      if (isValidationError(error.detail)) {
        setValidationErrors(error.detail, setError)
      } else {
        setError('root', { message: error.detail })
      }
      return
    }

    reset(data)
    toast({
      title: 'Organização Atualizada',
      description: `Organização foi atualizada com sucesso`,
    })

    if (onSubmitted) {
      onSubmitted()
    }
  }

  const handleFormSubmit = () => {
    handleSubmit(onSubmit)()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
        className="max-w-2xl"
      >
        <SettingsGroup>
          {!inKYCMode && (
            <>
              <SettingsGroupItem
                title="Identificador"
                description="Identificador único para sua organização"
              >
                <FormControl>
                  <CopyToClipboardInput
                    value={organization.id}
                    onCopy={() => {
                      toast({
                        title: 'Copiado Para a Área de Transferência',
                        description: `ID da Organização foi copiado para a área de transferência`,
                      })
                    }}
                  />
                </FormControl>
              </SettingsGroupItem>
              <SettingsGroupItem
                title="Slug da Organização"
                description="Usado para o Portal de Clientes, Extratos de Transações, etc."
              >
                <FormControl>
                  <CopyToClipboardInput
                    value={organization.slug}
                    onCopy={() => {
                      toast({
                        title: 'Copiado Para a Área de Transferência',
                        description: `Slug da Organização foi copiado para a área de transferência`,
                      })
                    }}
                  />
                </FormControl>
              </SettingsGroupItem>
            </>
          )}
          <div className="flex flex-col gap-y-4 p-4">
            <OrganizationDetailsForm
              organization={organization}
              inKYCMode={inKYCMode}
            />
          </div>

          <SettingsGroupActions>
            <ConfirmationButton
              onConfirm={handleFormSubmit}
              warningMessage="Esta informação não pode ser alterada uma vez enviada. Tem certeza?"
              buttonText={inKYCMode ? 'Enviar para Revisão' : 'Salvar'}
              size={inKYCMode ? 'default' : 'sm'}
              confirmText="Enviar"
              disabled={!formState.isDirty}
              loading={updateOrganization.isPending}
              requireConfirmation={inKYCMode}
            />
          </SettingsGroupActions>
        </SettingsGroup>
      </form>
    </Form>
  )
}

export default OrganizationProfileSettings

import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <div className="inline-flex space-x-6 animate-fade-in">
                <span className="rounded-full bg-blue-600/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 ring-1 ring-inset ring-blue-600/10">
                  What's new
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                  <span>Just shipped v1.0</span>
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl animate-fade-in-up">
              Create Beautiful Pricing Pages with Stripe
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 animate-fade-in-up animation-delay-200">
              Build, test, and optimize your pricing strategy with our no-code platform. Run A/B tests, track conversions, and maximize revenue.
            </p>
            <div className="mt-10 flex items-center gap-x-6 animate-fade-in-up animation-delay-400">
              <Link
                href="/auth/login"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:scale-105"
              >
                Get started
              </Link>
              <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none animate-float">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2432&ixlib=rb-4.0.3"
                  alt="Dashboard preview showing analytics and data visualization"
                  width={2432}
                  height={1442}
                  className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 transition-all hover:scale-105"
                />
                <div className="absolute bottom-4 right-4 text-xs text-white/70">
                  Photo by <a href="https://unsplash.com/@lukas" target="_blank" rel="noopener noreferrer" className="underline">Lukas</a> on <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline">Unsplash</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div id="features" className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 animate-fade-in">Deploy faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl animate-fade-in-up">
            Everything you need to optimize your pricing
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 animate-fade-in-up animation-delay-200">
            From A/B testing to analytics, we provide all the tools you need to create and optimize your pricing strategy.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none animate-fade-in-up animation-delay-400">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={feature.name} className="flex flex-col transition-all hover:scale-105">
                <div className="relative w-full mb-6">
                  <img
                    src={feature.image}
                    alt={feature.imageAlt}
                    className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                    width={2432}
                    height={1442}
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Templates Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 animate-fade-in">Ready to use</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl animate-fade-in-up">
            Beautiful Pricing Page Templates
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 animate-fade-in-up animation-delay-200">
            Choose from our collection of professionally designed templates and customize them to match your brand.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:mt-20 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 animate-fade-in-up animation-delay-400">
          {templates.map((template) => (
            <article key={template.name} className="flex flex-col items-start transition-all hover:scale-105">
              <div className="relative w-full">
                <img
                  src={template.image}
                  alt={template.name}
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                  width={2432}
                  height={1442}
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-6 flex items-center gap-x-4 text-xs">
                  <time dateTime={template.date} className="text-gray-500">
                    {template.date}
                  </time>
                  <span className="relative z-10 rounded-full bg-blue-600/10 px-3 py-1.5 font-medium text-blue-600">
                    {template.category}
                  </span>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900">
                    <Link href={template.href}>
                      <span className="absolute inset-0" />
                      {template.name}
                    </Link>
                  </h3>
                  <p className="mt-5 text-sm leading-6 text-gray-600">{template.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 animate-fade-in">Simple Process</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl animate-fade-in-up">
            How It Works
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 animate-fade-in-up animation-delay-200">
            Get started in minutes with our simple setup process and start optimizing your pricing strategy.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.name} className="flex flex-col transition-all hover:scale-105">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                    {step.number}
                  </div>
                  {step.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{step.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-blue-600 animate-fade-in">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl animate-fade-in-up">
            Loved by businesses worldwide
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.author.name} className="flex flex-col justify-between bg-white p-8 shadow-sm ring-1 ring-gray-900/5 rounded-2xl transition-all hover:scale-105">
                <div className="flex gap-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-6 text-lg leading-8 text-gray-600">
                  "{testimonial.content}"
                </blockquote>
                <div className="mt-8 flex items-center gap-x-4">
                  <img className="h-10 w-10 rounded-full bg-gray-50" src={testimonial.author.image} alt="" />
                  <div>
                    <div className="font-semibold">{testimonial.author.name}</div>
                    <div className="text-sm leading-6 text-gray-600">{testimonial.author.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8 animate-fade-in">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl animate-fade-in-up">
            Ready to optimize your pricing?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 animate-fade-in-up animation-delay-200">
            Join thousands of businesses using our platform to optimize their pricing strategy.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6 animate-fade-in-up animation-delay-400">
            <Link
              href="/auth/login"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:scale-105"
            >
              Get started
            </Link>
            <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    name: 'Drag-and-drop builder',
    description: 'Create beautiful pricing pages in minutes with our intuitive drag-and-drop interface.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2432&ixlib=rb-4.0.3',
    imageAlt: 'Modern interface showing drag and drop functionality',
    icon: function Icon(props: any) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          {...props}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
          />
        </svg>
      )
    },
  },
  {
    name: 'A/B Testing',
    description: 'Test different pricing strategies and optimize for maximum conversion with built-in A/B testing.',
    image: 'https://images.unsplash.com/photo-1556742393-75e5fc197a07?auto=format&fit=crop&q=80&w=2432&ixlib=rb-4.0.3',
    imageAlt: 'Analytics dashboard showing A/B test results',
    icon: function Icon(props: any) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          {...props}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
          />
        </svg>
      )
    },
  },
  {
    name: 'Analytics Dashboard',
    description: 'Track conversions, revenue, and user behavior with our comprehensive analytics dashboard.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2432&ixlib=rb-4.0.3',
    imageAlt: 'Detailed analytics dashboard with charts and metrics',
    icon: function Icon(props: any) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          {...props}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
          />
        </svg>
      )
    },
  },
]

const templates = [
  {
    name: 'Modern SaaS Pricing',
    description: 'A clean, modern design perfect for SaaS companies with multiple pricing tiers.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2432&ixlib=rb-4.0.3',
    date: '2024-03-20',
    category: 'SaaS',
    href: '/templates/saas-pricing',
  },
  {
    name: 'E-commerce Pricing',
    description: 'Optimized for online stores with product bundles and subscription options.',
    image: 'https://images.unsplash.com/photo-1556742393-75e5fc197a07?auto=format&fit=crop&q=80&w=2432&ixlib=rb-4.0.3',
    date: '2024-03-19',
    category: 'E-commerce',
    href: '/templates/ecommerce-pricing',
  },
  {
    name: 'Freelancer Pricing',
    description: 'Simple and elegant pricing page for freelancers and service providers.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2432&ixlib=rb-4.0.3',
    date: '2024-03-18',
    category: 'Freelancer',
    href: '/templates/freelancer-pricing',
  },
]

const steps = [
  {
    name: 'Connect Your Stripe Account',
    description: 'Link your Stripe account in just a few clicks to enable payment processing.',
    number: '1',
  },
  {
    name: 'Choose a Template',
    description: 'Select from our collection of professionally designed pricing page templates.',
    number: '2',
  },
  {
    name: 'Customize & Launch',
    description: 'Customize your pricing page and launch it to start collecting payments.',
    number: '3',
  },
]

const testimonials = [
  {
    content: "PriceOptimize has transformed how we handle our pricing strategy. The A/B testing features have helped us increase our conversion rate by 40%.",
    author: {
      name: 'Sarah Chen',
      role: 'CEO at TechStart',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&ixlib=rb-4.0.3',
    },
  },
  {
    content: "The drag-and-drop builder is incredibly intuitive. We were able to create our pricing page in less than an hour.",
    author: {
      name: 'Michael Rodriguez',
      role: 'Product Manager at GrowthCo',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256&ixlib=rb-4.0.3',
    },
  },
  {
    content: "The analytics dashboard gives us valuable insights into our pricing strategy. Highly recommended!",
    author: {
      name: 'Emma Thompson',
      role: 'Marketing Director at ScaleUp',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=256&ixlib=rb-4.0.3',
    },
  },
]

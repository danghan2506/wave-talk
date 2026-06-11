import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

const SigninPage = () => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-100/40">
      <div className="flex flex-col space-y-1.5 mb-6 text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome back
        </h2>
        <p className="text-xs font-medium text-slate-500">
          Enter your details below to sign in to your account
        </p>
      </div>

      <SignIn
        signUpUrl="/sign-up"
        forceRedirectUrl="/"
        appearance={{
          layout: {
            socialButtonsPlacement: "bottom",
            socialButtonsVariant: "blockButton",
          },
          variables: {
            colorPrimary: "#4f46e5", // indigo-600
            colorText: "#1e293b", // slate-800
            colorTextSecondary: "#64748b", // slate-500
            colorBackground: "transparent",
            colorInputBackground: "#f8fafc", // slate-50
            colorInputText: "#0f172a", // slate-900
            borderRadius: "0.875rem",
            spacingUnit: "0.95rem",
          },
          elements: {
            rootBox: "w-full",
            card: "shadow-none border-none bg-transparent p-0 w-full",
            headerTitle: "hidden", 
            headerSubtitle: "hidden",
            
            // Social Buttons
            socialButtonsBlockButton: 
              "bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-350 text-slate-700 transition-all duration-200 py-2.5 font-medium hover:scale-[1.01] shadow-sm",
            socialButtonsBlockButtonText: "font-semibold text-xs text-slate-700",
            socialButtonsBlockButtonArrow: "hidden",
            
            // Divider
            dividerLine: "bg-slate-200/80",
            dividerText: "text-slate-400 font-semibold text-[10px] uppercase tracking-wider",

            // Form Fields
            formFieldLabel: "text-slate-600 font-semibold text-xs mb-1.5 ml-0.5",
            formFieldInput: 
              "bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 text-slate-900 transition-all duration-200 pl-3.5 py-2.5 text-sm rounded-xl",
            
            // Key Action Buttons
            formButtonPrimary: 
              "bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 text-sm hover:shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:scale-[1.01] transition-all duration-200 active:scale-[0.99] rounded-xl shadow-sm border-none",
            
            // Footer - FORCE HIDE
            footer: "hidden",
            footerAction: "hidden",
            footerActionLink: "hidden",
            footerActionText: "hidden",
            identityPreview: "hidden",
          }
        }}
      />

      {/* Custom Navigation Footer */}
      <div className="mt-6 pt-5 border-t border-slate-200/80 w-full text-center">
        <p className="text-xs text-slate-500 font-medium">
          Don&apos;t have an account?{' '}
          <Link 
            href="/sign-up" 
            className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 cursor-pointer ml-1 relative group"
          >
            Sign up
            <span className="absolute -bottom-0.5 left-0 w-full h-[1.5px] bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-250 origin-left"></span>
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SigninPage
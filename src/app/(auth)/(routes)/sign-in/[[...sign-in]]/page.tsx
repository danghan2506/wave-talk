import { SignIn } from '@clerk/nextjs'

const SigninPage = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-3000"></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-[480px] p-8 sm:p-10 rounded-[2.5rem] 
                      bg-white/30 backdrop-blur-3xl border border-white/50 
                      shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:shadow-[0_8px_40px_0_rgba(31,38,135,0.1)]">
        
        <div className="flex flex-col items-center mb-8 space-y-2">
          <div className="relative">
             <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 drop-shadow-sm">
               WaveTalk
             </h1>
             <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600/20 to-pink-600/20 blur-xl opacity-50 -z-10"></div>
          </div>
           <p className="text-slate-500 font-medium text-lg tracking-wide">
             Connect properly.
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
              colorPrimary: "#4f46e5",
              colorText: "#1e293b", // slate-800
              colorTextSecondary: "#64748b", // slate-500
              colorBackground: "transparent",
              colorInputBackground: "rgba(255, 255, 255, 0.6)",
              colorInputText: "#0f172a",
              borderRadius: "1rem",
              spacingUnit: "1rem",
            },
            elements: {
              rootBox: "w-full",
              card: "shadow-none border-none bg-transparent p-0 w-full",
              headerTitle: "hidden", 
              headerSubtitle: "hidden",
              
              // Social Buttons
              socialButtonsBlockButton: 
                "bg-white/70 border border-white/60 hover:bg-white/90 text-slate-600 font-medium transition-all duration-200 hover:scale-[1.01] hover:shadow-sm",
              socialButtonsBlockButtonText: "font-semibold",
              socialButtonsBlockButtonArrow: "hidden",
              
              // Divider
              dividerLine: "bg-slate-200/80",
              dividerText: "text-slate-400 font-medium uppercase text-xs tracking-wider",

              // Form Fields
              formFieldLabel: "text-slate-600 font-semibold ml-1 mb-1.5 text-sm",
              formFieldInput: 
                "bg-white/60 border border-slate-200/60 focus:bg-white focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-100 transition-all duration-200 pl-4 py-3",
              
              // Key Action Buttons
              formButtonPrimary: 
                "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/30 border-none font-bold py-3 text-[15px] hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]",
              
              // Footer - FORCE HIDE
              footer: "hidden",
              footerAction: "hidden",
              footerActionLink: "hidden",
              footerActionText: "hidden",
              identityPreview: "hidden", // In case they are logged in context?
            }
          }}
        />

        {/* Custom Navigation Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200/50 w-full text-center">
          <p className="text-slate-500 font-medium">
            Don&apos;t have an account?{' '}
            <a 
              href="/sign-up" 
              className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors duration-200 cursor-pointer ml-1 relative group"
            >
              Sign up
              <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
            </a>
          </p>
        </div>
      </div>
      
      {/* Bottom Legal/Extra (Optional for Pro Max feel) */}
      <p className="absolute bottom-6 text-slate-400 text-xs font-medium tracking-wide opacity-60 mix-blend-multiply">
        © 2025 WaveTalk Inc. Secure & Encrypted.
      </p>

    </div>
  )
}

export default SigninPage
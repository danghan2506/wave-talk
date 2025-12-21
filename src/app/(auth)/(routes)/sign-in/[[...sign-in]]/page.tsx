import { SignIn } from '@clerk/nextjs'

const SigninPage = () => {
  return (
    // 1. Căn giữa form đăng nhập ra giữa màn hình
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      
      <SignIn
        // 2. Sử dụng prop appearance
        appearance={{
          // A. Variables: Dùng để đổi các thông số chung (màu, font, bo góc)
          variables: {
            colorPrimary: "#6F42C1", // Đổi màu nút chính
            colorText: "black",
            borderRadius: "0.5rem",
          },
          
          // B. Elements: Dùng để chọc vào từng class HTML cụ thể (Hỗ trợ Tailwind)
          elements: {
            // Tùy chỉnh container bên ngoài
            card: "shadow-xl border border-gray-200 bg-white",
            
            // Tùy chỉnh nút Submit (Sign in)
            formButtonPrimary: 
              "bg-indigo-500 hover:bg-indigo-600 text-sm normal-case",
            
            // Tùy chỉnh input field
            formFieldInput: 
              "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500",
            
            // Tùy chỉnh dòng footer (Don't have an account? Sign up)
            footerActionLink: "text-indigo-600 hover:text-indigo-500"
          }
        }}
        // Redirect sau khi login xong (tuỳ chọn)
        redirectUrl="/servers" 
      />
    </div>
  )
}

export default SigninPage
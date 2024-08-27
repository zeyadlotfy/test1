import { cookies } from "next/headers";
import RegisterForm from "./RegisterForm";
import { redirect } from "next/navigation";

const Register = () => {
    const token = cookies().get('jwtToken')?.value;
    if (token) {
        return redirect("/")
    }
    return <div>
        <h2 className="text-4xl pb-20">
            Register Page
        </h2>
        <RegisterForm />
    </div>;
};

export default Register;

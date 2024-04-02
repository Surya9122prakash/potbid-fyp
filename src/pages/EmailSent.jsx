import { useNavigate, useParams } from "react-router-dom";

const EmailSent = () => {
    const navigate = useNavigate();
    const { userEmail, reset } = useParams();

    return (
        <div className="flex justify-center items-center">
            {reset && userEmail && (
                <div className="bg-black flex flex-col">
                    <h1 className="text-xl text-white font-bold">Password Reset</h1>
                    <p className="text-white">
                        An email with password reset link has been sent to your email: <b className="text-white font-bold">{userEmail}</b>
                    </p>
                    <p className="text-white">
                        Check your email and click on the link to proceed!
                    </p>
                </div>
            )}
            {!reset && userEmail && (
                <div className="bg-black flex flex-col">
                    <h1 className="text-xl text-white font-bold">Account Verification</h1>
                    <p className="text-white">
                        An email with your account Verification link has been sent to your email: <b className="text-white font-bold">{userEmail}</b>
                    </p>
                    <p className="text-white">
                        Check your email and click on the link to proceed!
                    </p>
                    <button onClick={navigate("/login")}>Proceed</button>
                </div>
            )}
            {!reset && !userEmail && (
                <div className="bg-black flex flex-col">
                    <h1 className="text-xl text-white font-bold">Password Reset</h1>
                    <p className="text-white">
                        Your password has been reset successfully.
                    </p>
                    <p className="text-white">
                        You may now login!
                    </p>
                    <button onClick={navigate("/login")}>Login</button>
                </div>
            )}
        </div>
    )
}

export default EmailSent;
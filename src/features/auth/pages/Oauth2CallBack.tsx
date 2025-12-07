import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { oauth2Login, fetchCurrentUser } from "../store/authSlice";

const Oauth2Callback: React.FC = () => {
  const { provider } = useParams<{ provider: string }>();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Oauth2Callback mounted", { provider, code });
    const fetchToken = async () => {
      if (provider && code) {
        try {
          // Login OAuth2 and get token
          await dispatch(oauth2Login({ provider, code })).unwrap();

          // Fetch user info immediately
          await dispatch(fetchCurrentUser()).unwrap();

          // Navigate after both are complete
          navigate("/");
        } catch (err) {
          console.error("OAuth2 login failed", err);
          navigate("/login");
        }
      }
    };
    fetchToken();
  }, [provider, code, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-gray-600">Đang xử lý đăng nhập {provider}...</p>
      </div>
    </div>
  );
};

export default Oauth2Callback;

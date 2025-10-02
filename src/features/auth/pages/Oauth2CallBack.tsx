import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { oauth2Login } from "../store/authSlice"; // dùng thunk thay vì gọi API trực tiếp

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
          // Gọi thunk để login OAuth2
          await dispatch(oauth2Login({ provider, code })).unwrap();
          navigate("/"); // redirect về dashboard hoặc homepage
        } catch (err) {
          console.error("OAuth2 login failed", err);
          navigate("/login");
        }
      }
    };
    fetchToken();
  }, [provider, code, dispatch, navigate]);

  return <p>Đang xử lý đăng nhập {provider}...</p>;
};

export default Oauth2Callback;

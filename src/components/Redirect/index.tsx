import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Redirect = (props: { to: string }) => {
  const { to } = props;
  let navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  });
  return null;
};
export default Redirect;

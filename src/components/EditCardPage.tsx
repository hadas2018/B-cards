import { FunctionComponent } from "react";
import EditCard from "./EditCard";
// import EditCard from "../components/cards/EditCard";

interface EditCardPageProps {}

const EditCardPage: FunctionComponent<EditCardPageProps> = () => {
  return (
    <>
      <EditCard />
    </>
  );
};

export default EditCardPage;
import React from "react";
import { useParams } from "react-router-dom";

function DynamicPage() {
  const { id } = useParams();
  return (
    <div className="bg-white h-1/2 w-1/2 ml-96">
      <h1>This is a dynamic page for {id} </h1>
    </div>
  );
}

export default DynamicPage;

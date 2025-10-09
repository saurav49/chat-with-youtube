import { Button } from "@/components/ui/button";

const ContentPage = () => {
  return (
    <div
      // className="fixed bottom-10 right-10 border border-red-500"
      className="dark z-50"
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
      }}
    >
      <Button>Click me</Button>
    </div>
  );
};

export default ContentPage;

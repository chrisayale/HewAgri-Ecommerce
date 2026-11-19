import Typography from "antd/es/typography/Typography";

const LayoutCompWithTable = ({
  title,
  btn,
  content,
}: {
  title: React.ReactNode;
  btn: React.ReactNode;
  content: React.ReactNode;
}) => {
  return (
    <div className=" flex items-center flex-col w-full py-4 gap-10">
      <div className=" w-full flex justify-between items-center">
        <Typography className=" font-semibold text-xl">{title}</Typography>

        <div>{btn}</div>
      </div>

      <div className=" w-full">{content}</div>
    </div>
  );
};

export default LayoutCompWithTable;

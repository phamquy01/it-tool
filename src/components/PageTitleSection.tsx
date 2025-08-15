import FavoriteTool from './FavoriteTool';

const PageTitleSection = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const convertTitleToPath = (title: string) => {
    return '/' + title.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <div className="max-w-[600px] mx-auto py-10">
      <div className="flex items-center justify-between ">
        <h1 className="opacity-90 !text-[40px] font-medium m-0 leading-tight">
          {title}
        </h1>
        <FavoriteTool tool={{ path: convertTitleToPath(title) }} />
      </div>
      <div className="w-[200px] h-0.5 bg-gray-300 opacity-20 my-2.5"></div>
      <div>
        <p className="m-0 opacity-70">{description}</p>
      </div>
    </div>
  );
};
export default PageTitleSection;

import { Separator } from '@/components/ui/separator';

const NotFound = () => {
  return (
    <div className="flex flex-grow flex-row items-center justify-center font-sans">
      <h1 className="mr-5 block pr-6 align-top text-2xl font-medium leading-[49px]">
        404
      </h1>
      <Separator orientation="vertical" className="h-10" />
      <div className="ml-5 block ">
        <h2 className="m-0 text-sm font-normal leading-[49px]">
          This page could not be found
        </h2>
      </div>
    </div>
  );
};

export default NotFound;

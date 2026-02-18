import Image from 'next/image';
import aboutPic from '../../../public/about.jpg';

const About = () => {
  return (
    <div className="mt-8 flex flex-row gap-10 p-5">
      <Image
        src={aboutPic}
        alt="about picture"
        className="hidden max-w-[30%] md:block"
        placeholder="blur"
        blurDataURL={`${aboutPic}`}
        loading="lazy"
      />
      <div className="flex flex-col justify-center gap-10">
        <h1 className="text-center text-2xl font-bold">About Us</h1>
        <p>
          Welcome to Fooder, where passion for food meets seamless
          online ordering. Our journey began with a simple yet
          powerful idea: to bring delectable dishes from your favorite
          local restaurants directly to your doorstep. At Fooder, we
          believe in the joy of sharing good food and creating
          memorable dining experiences. Explore our diverse menu,
          curated with care, and join us in celebrating the love for
          delicious cuisine. Discover the Fooder, where innovation,
          flavor, and convenience converge to redefine the way you
          experience food.
        </p>
      </div>
    </div>
  );
};

export default About;

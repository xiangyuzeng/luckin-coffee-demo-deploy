import Image from 'next/image';
import contactPic from '../../../public/contact.jpg';

const Contact = () => {
  return (
    <div>
      <Image
        src={contactPic}
        alt="contact picture"
        width="0"
        height="0"
        className="mx-auto mt-5 h-auto max-w-full"
        placeholder="blur"
        blurDataURL={`${contactPic}`}
        loading="lazy"
      />
      <div className="mb-8 mt-8 flex flex-col gap-4">
        <div>
          We&apos;re here to make your food ordering experience
          exceptional, and your feedback matters. Reach out to us
          anytime - whether you have a question, suggestion, or just
          want to say hello. Our dedicated customer support team is
          ready to assist you.
        </div>
        <div>Connect with us through the following channels</div>
        <div>
          <h3 className="font-bold">Customer Support:</h3>
          <div>
            <div className="text-muted-foreground">
              <b>Phone:</b> +43 43 43 43 652
            </div>
            <div className="text-muted-foreground">
              <b>Email:</b> fooder@example.com
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Visit us</h3>
          <div className="text-muted-foreground">
            324324, Arizona, Tuttle 623
          </div>
        </div>
        <div>
          Thank you for choosing <b>Fooder</b>. Your satisfaction is
          our priority, and we look forward to serving you the finest
          flavors with a touch of convenience!
        </div>
      </div>
    </div>
  );
};

export default Contact;

import Image from 'next/image';
import type { FC } from 'react';

import { Section } from '../Section';
import BusinessPlanImage from './images/Business Plan.png';
import ClientContractPage1Image from './images/Client Contract Page 1.png';
import ClientInvoiceTemplateImage from './images/Client Invoice Template.png';
import ClientOnboardingPackageImage from './images/Client Onboarding Package.png';
import InstagramTemplatesImage from './images/Instagram Templates.png';
import PinterestTemplateImage from './images/Pinterest Template.png';
import styles from './index.module.scss';

export const DesignResources: FC = () => (
  <Section>
    <div className="container">
      <h2>Career Essentials Collection</h2>
      <p>In QC's Career Essentials Collection, you'll find a bonus lesson to teach you how to work with design software. You'll also find 6 fully customizable templates specially designed to help you build a thriving business.</p>
      <h3>Bonus Lesson</h3>
      <p>In this lesson, you'll learn how to apply your knowledge of scale and design drawings to effectively work with design software. You'll study the different types of software available to you and get tips to help you choose the best option for your business. You'll watch a series of video tutorials with DesignFiles, an all-in-one software that allows you to create digital floorplans, mood boards and more.</p>
      <p><a className="btn btn-primary" href="/resources/working-with-design-software/content">Open Lesson</a></p>
      <h3>Business Kit Templates</h3>
      <p>All you need to access your business kit templates is a free Canva account. If you don't have an account, you can <a href="https://www.canva.com" target="_blank" rel="noreferrer">sign up here</a>. Once you've signed up for your account, you'll be all set to begin customizing your templates. Simply click on the links below to get started.</p>
      <p className="fw-bold">Once you have your free Canva account, you can access your templates below. Happy customizing!</p>
      <div className="row justify-content-center g-4 text-center mt-3">
        <div className="col-12 col-sm-6 col-lg-4">
          <h4 className="h5">Invoice Template</h4>
          <Image src={ClientInvoiceTemplateImage} alt="Client Invoice Template" className={styles.thumbnail} />
          <a className="btn btn-primary" href="https://www.canva.com/design/DAF0QhIf_LQ/ZHL7ov3N2mX1MuW1Ek3IHA/view?utm_content=DAF0QhIf_LQ&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" target="_blank" rel="noreferrer">Open Template</a>
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <h4 className="h5">Client Contract</h4>
          <Image src={ClientContractPage1Image} alt="Client Contract" className={styles.thumbnail} />
          <a className="btn btn-primary" href="https://www.canva.com/design/DAF0QotRRLY/RiGg-Vrl-UxGOEVvqdHeuQ/view?utm_content=DAF0QotRRLY&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" target="_blank" rel="noreferrer">Open Template</a>
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <h4 className="h5">Business Plan</h4>
          <Image src={BusinessPlanImage} alt="Business Plan" className={styles.thumbnail} />
          <a className="btn btn-primary" href="https://www.canva.com/design/DAF0Qtc7x10/lcyH1W3y_j1bIuzZ88T3ww/view?utm_content=DAF0Qtc7x10&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" target="_blank" rel="noreferrer">Open Template</a>
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <h4 className="h5">Onboarding Pack</h4>
          <Image src={ClientOnboardingPackageImage} alt="Client Onboarding Package" className={styles.thumbnail} />
          <a className="btn btn-primary" href="https://www.canva.com/design/DAF0QlCvDDQ/odGbIDYXVdl3BDVs6TqrHA/view?utm_content=DAF0QlCvDDQ&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" target="_blank" rel="noreferrer">Open Template</a>
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <h4 className="h5">Instagram Templates</h4>
          <Image src={InstagramTemplatesImage} alt="Instagram Templates" className={styles.thumbnail} />
          <a className="btn btn-primary" href="https://www.canva.com/design/DAF0QjDH2VI/Kzqgt-CF1NmOhQv45KznMA/view?utm_content=DAF0QjDH2VI&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" target="_blank" rel="noreferrer">Open Template</a>
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <h4 className="h5">Pinterest Templates</h4>
          <Image src={PinterestTemplateImage} alt="Pinterest Templates" className={styles.thumbnail} />
          <a className="btn btn-primary" href="https://www.canva.com/design/DAF0QgnFBxA/9tkVbIg8Xzajoi4ZDtWzUg/view?utm_content=DAF0QgnFBxA&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" target="_blank" rel="noreferrer">Open Template</a>
        </div>
      </div>
    </div>
  </Section>
);

import type { SchoolSlug } from '@/domain/school';

export type CourseSuggestion = {
  code: string;
  name: string;
  certification: string;
  shortDescription: string;
  description: string | string[] | JSX.Element;
};

export type CourseSuggestionGroup = {
  id: string;
  description: string;
  courses: CourseSuggestion[];
};

export const courseSuggestionGroups: Record<SchoolSlug, CourseSuggestionGroup[]> = {
  event: [
    {
      id: 'high-budget-events',
      description: 'QC Event Planning',
      courses: [
        {
          code: 'EP',
          name: 'Event & Wedding Planning',
          certification: 'International Event and Wedding Planning Professional',
          shortDescription: 'Get comprehensive training to succeed in the event and wedding planning industry.',
          description: 'QC\'s Event and Wedding Planning course will teach you how to plan and organize milestone parties, weddings, industry special events, and more! Learn to develop an event concept and theme that will perfectly execute your client\'s vision. You\'ll learn to hire and negotiate contracts with event vendors, work with a budget, and discover important business skills, including planning a styled shoot and marketing your business.',
        },
        {
          code: 'CP',
          name: 'Corporate Event Planning',
          certification: 'International Corproate Event Planning Professional',
          shortDescription: 'Expand your career opportunities with comprehensive training to plan successful events in the corporate world.',
          description: 'QC\'s Corporate Event Planning certification will expand your business and prepare you to plan events in a wide range of industries, including tech, non-profit, government and fashion. You\'ll complete hands-on, practical assignments to learn how to plan and manage all types of corporate events from product launches and corporate social events to promotional campaigns.',
        },
        {
          code: 'WP',
          name: 'Wedding Planning Course',
          certification: 'International Wedding Planning Professional',
          shortDescription: 'Build a successful career helping couples achieve the wedding of their dreams.',
          description: 'QC\'s Wedding Planning course will provide you with the practical planning tools you need to turn your clients\' dreams into reality. You\'ll learn to prepare the wedding budget, plan the wedding timeline, source reputable vendors, and explore cultural and religious variations of weddings. You\'ll also have the opportunity to study how you can start your own business and market your wedding planning services to clients.',
        },
        {
          code: 'CE',
          name: 'Private Event Planning Course',
          certification: 'International Event Planning Professional',
          shortDescription: 'Graduate with a competitive edge and set yourself up for success planning industry events and parties.',
          description: 'QC\'s Private Event Planning course will prepare you to plan industry events, milestone parties, holiday parties and more that exceed your clients\' expectations. You\'ll study every aspect of event planning, from prioritizing the budget to day-of coordination. You\'ll also have the opportunity to study how you can start your own business and market your event planning services to a variety of clients.',
        },
        {
          code: 'DW',
          name: 'Destination Wedding Planning',
          certification: 'Destination Wedding Specialist',
          shortDescription: 'Add destination wedding planning to your services to expand your business all over the world.',
          description: 'QC\'s Destination Wedding Planning course will show you how to organize and coordinate weddings in faraway cities and distant countries. You\'ll learn how to coordinate with specialized professionals including event vendors, translators and travel agents remotely to ensure your clients get the destination wedding of their dreams.',
        },
        {
          code: 'LW',
          name: 'Luxury Wedding Planning',
          certification: 'Luxury Wedding and Event Specialist',
          shortDescription: 'Plan upscale events to grow your business and appeal to high-budget clients.',
          description: 'With QC\'s Luxury Wedding & Event Planning course, you\'ll learn to manage large budgets to plan lavish weddings, meetings, parties and other celebrations. You\'ll study strategies to build a network of top suppliers and vendors and discover how to market your services as a luxury event planner to high-end clients and companies.',
        },
        {
          code: 'FD',
          name: 'Floral Design',
          certification: 'International Floral Design Professional',
          shortDescription: 'Develop hands-on skills to build a successful career in the event and floral industry.',
          description: 'Learn how to design a wide range of floral arrangements for events, from boutonnieres and bridal bouquets to vase arrangements. Study the anatomy of plants and learn about plant care to ensure longevity in your arrangements and learn to apply the principles and elements of design to working with flowers.',
        },
        {
          code: 'ED',
          name: 'Event Decor',
          certification: 'International Event Decorating Professional',
          shortDescription: 'QC\'s Event Decor course allows you to add event design services to your business and run your business effectively.',
          description: 'You\'ll be prepared to work with event planning professionals to execute breathtaking events. You\'ll learn to use color matching, popular themes and the latest trends to create a cohesive, modern look. Discover how you can combine all elements of an event to create a beautiful, cohesive presentation to win over any client.',
        },
        {
          code: 'PE',
          name: 'Promotional Event Planning',
          certification: 'Promotional Events Specialist',
          shortDescription: 'Stay on top of industry trends to plan promotional events for corporate clients.',
          description: 'QC\'s Promotional Event Planning course will build on your knowledge of corporate event planning. You\'ll learn how to maximize the reach of a variety of promotional events, from marketing campaigns to pop-up shops, and stay ahead of industry trends. Develop the skills you need to work for marketing and event agencies, or venture into promotional events with your own business.',
        },
        {
          code: 'FL',
          name: 'Festivals & Live Events',
          certification: 'International Festivals and Live Events Planning Specialist',
          shortDescription: 'Reach more clients by adding festivals and live event planning to your repertoire.',
          description: 'With QC\'s Festivals and Live Events workshop, you\'ll learn how to expand on your existing corporate event planning skills to succeed in the live events industry. You\'ll study exciting topics including concert promotion, show production, sports entertainment production festival planning and more. Learn the logistics of planning small and large-scale live events, including managing risk factors and working with entertainment.',
        },
        {
          code: 'EB',
          name: 'Accelerate Your Business',
          certification: 'Accelerate Your Business Workshop completion',
          shortDescription: 'Take your business to the next level.',
          description: 'This course will walk you through the best business practices to grow your existing event planning business. With guidance from your expert tutor, you\'ll build customer personas, improve your online presence, develop marketing materials, and more! You\'ll graduate with an elevated business strategy to help you surpass the competition.',
        },
        {
          code: 'TT',
          name: 'Travel and Toursim Course',
          certification: 'International Travel and Tourism Consultant',
          shortDescription: 'Expand your destination wedding planning business by offering full travel services.',
          description: 'With QC\'s Travel and Tourism Course, you\'ll learn all about the history of travel, geography, cruise and tour booking, accommodations, transportation and more. You\'ll develop the skills you need to plan unforgettable vacations that your clients will talk about for years to come. Take your destination wedding planning skills to the next level by becoming a travel consultant.',

        },
        {
          code: 'VE',
          name: 'Virtual Events Training Course',
          certification: 'Virtual Events Training Course Certificate',
          shortDescription: 'Expand your business by offering virtual planning services.',
          description: 'With QC\'s Virtual Events Training mini-course, you can help fill the demand for skilled virtual event planners. You\'ll build on your foundational event planning skills to learn to manage the technical aspects of a virtual event and create an experience that\'s just as engaging as an in-person event. Learn how to make a couple\'s wedding dreams come true virtually, plan an online conference with thousands of attendees, and much more.',

        },
      ],
    },
  ],
  wellness: [
    {
      id: 'sleep-spaces',
      description: 'QC Wellness Studies',
      courses: [
        {
          code: 'SL',
          name: 'Infant Sleep Consultant Course',
          certification: 'Infant Sleep Consulting Professional',
          shortDescription: 'Get certified to help parents and caregivers create healthy sleep habits for their infants and toddlers.',
          description: 'With QC\'s Infant Sleep Consultant course, you\'ll develop the skills you need to recommend sleep training methods that work for both infants and parents, and establish appropriate bedtime routines and sleep spaces. Through detailed lessons and course videos, you\'ll learn to consult with parents and caregivers, and create individualized sleep plans to set your clients up for success. You\'ll also discover how you can start your own sleep consulting business and market your services. ',
        },
        {
          code: 'PO',
          name: 'Professional Organizing',
          certification: 'Advanced International Organizing Professional',
          shortDescription: 'In partnership with QC Design School, our Professional Organizing course will ensure you have the necessary skills to design restful sleep spaces for your clients.',
          description: 'You\'ll learn to identify your clients\' needs and plan the optimal function of each room in the home, including the bedroom. Develop essential design skills, including room measurements, floor planning and furniture layouts, and fine tune your approach to working with different client personalities.',
        },
        {
          code: 'CC',
          name: 'Color Consultant Course',
          certification: 'International Color Consulting Professional',
          shortDescription: 'Our Color Consultant course, offered by QC Design School, prepares you to offer highly valuable consultation services, using color to create restful sleep spaces.',
          description: 'You\'ll study challenging topics like the ways lighting and undertones affect color choices, and how to work with open-concept spaces. Learn key theoretical and practical skills to design custom interiors from award-winning interior designer and television personality Jane Lockhart in a series of instructional videos.',
        },
      ],
    },
  ],
  design: [
    {
      id: 'add-value-homes',
      description: 'QC Design School',
      courses: [
        {
          code: 'LD',
          name: 'Landscape Design',
          certification: 'International Landscape Design Professional',
          shortDescription: 'QC\'s Landscape Design course will jumpstart your career planning beautiful outdoor designs in this fast-growing industry.',
          description: 'You\'ll develop a keen understanding of design concepts like scale and color theory, and how to apply these concepts to outdoor spaces. You\'ll learn to work with plants and other features to design living landscapes that thrive in different climates. Homeowners spend millions of dollars every year to create ideal outdoor spaces that suit their clients\' needs and add value to their homes.',
        },
        {
          code: 'ST',
          name: 'Home Staging',
          certification: 'International Staging and Redesign Professional',
          shortDescription: 'QC\'s Home Staging course prepares you for a highly sought after career designing homes that attract buyers and sell for the best price possible.',
          description: 'You\'ll learn to assess the client\'s home to optimize the space through the strategic organizing of existing furniture and home accessories. You\'ll study the process of depersonalizing, redesign and improving curb appeal. Through this process, you\'ll create a sense of possibility to potential home buyers and add perceived value to your clients\' homes.',
        },
        {
          code: 'I2',
          name: 'Interior Decorating',
          certification: 'International Design and Decorating Professional',
          shortDescription: 'QC\'s Interior Decorating course allows you to channel your passion for home decor into a successful career in a thriving, multi-billion dollar industry.',
          description: 'You\'ll learn how to create custom interiors that exceed your client\'s expectations. Step-by-step videos featuring QC tutor Angie Chapman will walk you through creating a professional floorplan. You\'ll learn about color theory in home design, wall treatments, furniture placement, and more. You\'ll practice your design skills through hands-on and theory-based assignments.',
        },
        {
          code: 'LD',
          name: 'Landscape Design',
          certification: 'International Landscape Design Professional',
          shortDescription: 'QC\'s Landscape Design course will jumpstart your career planning beautiful outdoor designs in this fast-growing industry.',
          description: 'You\'ll develop a keen understanding of design concepts like scale and color theory, and how to apply these concepts to outdoor spaces. You\'ll learn to work with plants and other features to design living landscapes that thrive in different climates. Homeowners spend millions of dollars every year to create ideal outdoor spaces that suit their clients\' needs and add value to their homes.',
        },
        {
          code: 'FD',
          name: 'Floral Design',
          certification: 'International Floral Design Professional',
          shortDescription: 'Develop hands-on skills to build a successful career in the floral industry, whether you want to work as a florist or add to existing services.',
          description: 'Learn how to design a wide range of floral arrangements, from boutonnieres and bridal bouquets to vase arrangements. Study the anatomy of plants and learn about plant care to ensure longevity in your arrangements and learn to apply the principles and elements of design to working with flowers.',
        },
        {
          code: 'ED',
          name: 'Event Decor',
          certification: 'International Event Decorating Professional',
          shortDescription: 'QC\'s Event Decor course allows you to add event design services to your business and run your business effectively.',
          description: 'You\'ll be prepared to work with event planning professionals to execute breathtaking events. You\'ll learn to use color matching, popular themes and the latest trends to create a cohesive, modern look. Discover how you can combine all elements of an event to create a beautiful, cohesive presentation to win over any client.',
        },
        {
          code: 'AP',
          name: 'Aging in Place',
          certification: 'Aging in Place Professional',
          shortDescription: 'Apply your design skills to offer an essential service to any client with aging concerns. Create safe and convenient spaces for aging clients.',
          description: 'Clients often hire an Aging in Place designer to help them stay in their home instead of moving to an assisted living facility. QC\'s Aging in Place course will prepare you to design beautiful, safe and functional spaces that allow your clients to keep their independence for as long as possible.',
        },
        {
          code: 'PO',
          name: 'Professional Organizing',
          certification: 'Advanced International Organizing Professional',
          shortDescription: 'With QC\'s Professional Organizing course, you\'ll develop the skills you need to restore order and productivity in your clients\' homes and offices.',
          description: 'You\'ll learn to identify your clients\' needs and plan the optimal function of each room in the home. Enhance your design skills, including room measurements, floor planning and furniture layouts, and fine tune your approach to working with different client personalities. You\'ll practice implementing your project and delivering maintenance plans with assignments based on real client problems.',
        },
        {
          code: 'FS',
          name: 'Feng Shui',
          certification: 'Advanced Feng Shui Design Professional',
          shortDescription: 'Make use of QC\'s expert training to offer feng shui design services and bring harmony and positive energy to your clients\' home.',
          description: 'You\'ll learn to design comfortable spaces and restore balance in your clients\' lives using ancient feng shui principles. You\'ll study ch\'i flow, the five elements, yin and yang energy and the baugua map. In this course, you\'ll also learn to personalize your feng shui practice to suit your clients\' modern needs.',
        },
      ],
    },
  ],
  pet: [
    {
      id: 'full-service-dog-care',
      description: 'QC Pet Studies',
      courses: [
        {
          code: 'DD',
          name: 'Dog Daycare',
          certification: 'International Dog Care Professional',
          shortDescription: 'Dog owners need help looking after their four-legged friends. Develop skills you need to launch a lucrative career as a dog-care professional.',
          description: 'Study everything from basic dog behavior and communication to safe dog-handling techniques. You\'ll gain a thorough understanding of different dog-care services, including walking, daycare and boarding, and learn the best practices to become a trusted expert in your field.',
        },
        {
          code: 'DT',
          name: 'Dog Training',
          certification: 'International Dog Training Professional',
          shortDescription: 'Help dog owners turn their beloved pets into well-behaved family members. Dog owners need trusted professionals to help them manage their furry friends.',
          description: 'Study how dogs learn, behave and communicate so you\'ll be ready to work with dogs and their owners. QC\'s Dog Training course uses scientifically proven dog training methods to teach dogs new behaviors and discourage unwanted ones. A series of practical assignments will prepare you to teach training classes and offer private lessons in this booming industry.',
        },
        {
          code: 'DG',
          name: 'Dog Grooming',
          certification: 'International Dog Grooming Professional',
          shortDescription: 'Offer in-demand grooming services for your clients\' furry family members. With QC\'s hands-on training, develop the skills you need to groom a dog from start to finish.',
          description: 'This course will begin by outlining the fundamentals of grooming, including safety, first aid, dog anatomy and tools. You\'ll learn how to complete perfect prep work for a groom by practicing bathing, drying, nail clipping and brushing. Then you\'ll master pet cuts and breed standards through a series of practical assignments.',
        },
      ],
    },
  ],
  makeup: [
    {
      id: 'look-their-best',
      description: 'QC Makeup Academy',
      courses: [
        {
          code: 'HS',
          name: 'Hair Styling Essentials',
          certification: 'Hair Styling Essentials Certificate',
          shortDescription: 'Get an edge in the beauty industry by combining makeup artistry with professional hair styling to complete your client\'s look.',
          description: 'Learn how to style braids, blow-outs, updos and period looks with step-by-step instructions and video tutorials. Expand your beauty services to offer hair styling to bridal clients, or get the skills you need to work on film, television and photography sets.',
        },
        {
          code: 'SK',
          name: 'Skincare Consultant',
          certification: 'International Skincare Consulting Professional',
          shortDescription: 'Add professional skincare consultations to your service offerings. Proper skincare is vital for any client who\'s serious about their beauty routine.',
          description: 'This course will prepare you to work closely with clients to choose the best products for each individual. Learn to create a routine to help your clients have healthy, beautiful skin. They\'ll feel more confident and, as a makeup artist, you\'ll get to work with a flawless canvas!',
        },
        {
          code: 'MW',
          name: 'Pro Makeup Workshop',
          certification: 'Pro Makeup Workshop Certificate',
          shortDescription: 'Take your makeup artistry skills to the next level with coveted tricks of the trade from celebrity makeup artist, Nathan Johnson.',
          description: 'Practice advanced makeup application techniques with specialized feedback from your tutor. You\'ll practice 15 glamorous makeup looks to prepare you for editorial work and special events. This course will help you gain the skills that creative directors and producers are looking for in a makeup artist.',
        },
        {
          code: 'AB',
          name: 'Airbrush Makeup',
          certification: 'Airbrush Makeup Workshop Certificate',
          shortDescription: 'Diversify your techniques and service offerings by learning to apply airbrush makeup.',
          description: 'Learn impressive makeup techniques to create flawless complexions. In this course, you\'ll develop the skills you need to create gorgeous makeup looks for every occasion, including a focus on bridal makeup. You\'ll become certified to work in top sectors of the beauty industry.',
        },
        {
          code: 'PW',
          name: 'Portfolio Development',
          certification: 'Portfolio Development Certificate',
          shortDescription: 'Build a professional portfolio that wows potential clients with your talent and skill!',
          description: 'In this workshop, you\'ll learn to organize and execute styled shoots to produce high-quality photos that appeal to your clients. You\'ll learn essential skills to help you develop your professional network and advance your makeup artistry business.',
        },
        {
          code: 'SF',
          name: 'Special FX Makeup',
          certification: 'International Special FX Makeup Professional',
          shortDescription: 'Expand your makeup skills to become more competitive in the makeup industry.',
          description: 'In this course, you\'ll learn how to age characters, create realistic injuries, and apply prosthetics including hair pieces and wounds. With plenty of hands-on training, you\'ll gain the skills you need to build a successful makeup artistry business working in theater, television or film.',
        },
        {
          code: 'AB',
          name: 'Airbrush Makeup',
          certification: 'Airbrush Makeup Workshop Certificate',
          shortDescription: 'Diversify your techniques and service offerings by learning to apply airbrush makeup.',
          description: 'Learn impressive makeup techniques to create flawless complexions. In this course, you\'ll develop the skills you need to create gorgeous makeup looks for every occasion, including a focus on bridal makeup. You\'ll become certified to work in top sectors of the beauty industry.',
        },
        {
          code: 'GB',
          name: 'Global Beauty Workshop',
          certification: 'Global Beauty Workshop Certificate',
          shortDescription: 'Boost your professional makeup training with an international specialization.',
          description: 'QC\'s Global Beauty Workshop will teach you to diversify your makeup techniques by creating gorgeous makeup looks form different cultural and religious traditions around the world. You\'ll study international makeup techniques for a range of skin tones and refine your skills with plenty of hands-on training.',
        },
        {
          code: 'PF',
          name: 'Fashion Styling',
          certification: 'Certified International Styling Professional Certification',
          shortDescription: 'Expand your beauty services by becoming a fashion stylist.',
          description: 'Diversify your skills through QC\'s Fashion Styling course. Learn how to create fashionable looks for clients of all ages and body types. You can expand your services to become a more competitive professional in the beauty industry, while helping your clients feel and look their best.',

        },
        {
          code: 'VM',
          name: 'Virtual Makeup Training',
          certification: 'Virtual Makeup Certificate',
          shortDescription: 'QC\'s Virtual Makeup Training will teach you how to take your makeup or skincare business online.',
          description: 'You\'ll develop the skills you need to grow your business by consulting with clients all over the world. You\'ll study the consultation process from start to finish, and watch Nathan Johnson take you through conduct a full consultation with a real client.',
        },
      ],
    },
  ],
  writing: [],
};

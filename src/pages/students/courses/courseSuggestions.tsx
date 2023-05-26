import type { CourseSuggestionGroup } from '@/domain/courseSuggestion';
import type { SchoolSlug } from '@/domain/school';

export const courseSuggestionGroups: Record<SchoolSlug, CourseSuggestionGroup[]> = {
  event: [
    {
      id: 'high-budget-events',
      description: 'Plan high-budget events.',
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
      ],
    },
    {
      id: 'beautiful-events',
      description: 'Execute beautiful events with hands-on skills.',
      courses: [
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
      ],
    },
    {
      id: 'corporate-clients',
      description: 'Stand out to corporate clients.',
      courses: [
        {
          code: 'CP',
          name: 'Corporate Event Planning',
          certification: 'International Corporate Event Planning Professional',
          shortDescription: 'Expand your career opportunities with comprehensive training to plan successful events in the corporate world.',
          description: 'QC\'s Corporate Event Planning certification will expand your business and prepare you to plan events in a wide range of industries, including tech, non-profit, government and fashion. You\'ll complete hands-on, practical assignments to learn how to plan and manage all types of corporate events from product launches and corporate social events to promotional campaigns.',
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
      ],
    },
  ],
  wellness: [
    {
      id: 'sleep-spaces',
      description: 'Plan ideal sleep spaces.',
      courses: [
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
      description: 'Add value to your clients\' homes.',
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
      ],
    },
    {
      id: 'expand-skills-home',
      description: 'Expand your design skills outside the home.',
      courses: [
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
      ],
    },
    {
      id: 'difference-design',
      description: 'Make a difference with design.',
      courses: [
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
      description: 'Provide full-service dog care.',
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
        {
          code: 'DC',
          name: 'Dog Behavior',
          certification: 'International Dog Behavior Specialist',
          shortDescription: 'Dog owners often need help to address their pets’ challenging behavior issues. Help dogs overcome anxiety and reactivity to become the best furry companions they can be!',
          description: <>Pet parents are desperate for specialized trainers who can help them overcome specific challenges and concerns with their pups, including anxiety and aggression. With QC's Dog Behavior Course, you'll take your training skill to the next level as you learn the entire behavior modification process from start to finish. You'll be well-prepared to confidently address common concerns like anxiety, phobias and even aggression. <a href="https://www.qcpetstudies.com/teasers/dog-behavior/content/index.html" target="_blank" rel="noopener noreferrer">View the course teaser</a></>,
        },
      ],
    },
  ],
  makeup: [
    {
      id: 'look-their-best',
      description: 'Help your clients feel and look their best.',
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
      ],
    },
    {
      id: 'jumpstart-advanced',
      description: 'Jumpstart your career with advanced training.',
      courses: [
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
          code: 'MW',
          name: 'Pro Makeup Workshop',
          certification: 'Pro Makeup Workshop Certificate',
          shortDescription: 'Take your makeup artistry skills to the next level with coveted tricks of the trade from celebrity makeup artist, Nathan Johnson.',
          description: 'Practice advanced makeup application techniques with specialized feedback from your tutor. You\'ll practice 15 glamorous makeup looks to prepare you for editorial work and special events. This course will help you gain the skills that creative directors and producers are looking for in a makeup artist.',
        },
      ],
    },
    {
      id: 'tv-film-theatre',
      description: 'Work in television, film and theater.',
      courses: [
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
      ],
    },
  ],
  writing: [],
};

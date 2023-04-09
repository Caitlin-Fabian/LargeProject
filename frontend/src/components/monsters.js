import plant_monster from "../assets/1.png";
import raptor from "../assets/2.png"
import robot from "../assets/3.png";
import knightro from '../assets/4.png';
import citronaut from '../assets/5.png';
import pegasus from '../assets/6.png';
import squeaky from '../assets/9.png';
import sealy from '../assets/10.png';


export const monsters = [
    {
        id: 1,
        title: 'Arboretum Monster',
        picture: plant_monster,
        description:
            "This plant is always on the hunt for its next meal, and with its massive jaws and insatiable appetite, it's not hard to see why it's known as the top predator of the botanical world.",
        pos: { lat: 28.600904362555667, lng: -81.19679500000177 },//Arboretum
    },
    {
        id: 2,
        title: 'Ruckus Raptor',
        picture: raptor,
        description:
            'A mischievous dinosaur that hides in the bushes around the Recreation and Wellness Center, and steals equipment from unsuspecting athletes.',
        pos: { lat:28.59617335594502, lng: -81.19928468705896 }, //RWC
    },
    {
        id: 3,
        title: 'Zappy',
        picture: robot,
        description:
            "A zany robot which resides in the University of Central Florida's Engineering building, where it spends its days tinkering with nuts, bolts, and wires. ",
        pos: { lat:28.601544015088933, lng: -81.19836166423842},//Eng II
    },
    {
        id: 4,
        title: 'Knightro',
        picture: knightro,
        description: "With its towering stature and signature black and gold armor, Knightro is a force to be reckoned with. But don't let its intimidating appearance fool you - this knight has a wild side.",
        pos: { lat: 28.60476091853676, lng: -81.19874574883731 }//Memory Mall
    },
    {
        id: 5,
        title: 'Citronaut',
        picture: citronaut,
        description: "Citronaut is a citrusy astronaut that loves to orbit around the University of Central Florida spreading its out-of-this-world cheer. With its orange spacesuit and giant helmet, Citronaut is impossible to miss and always up for an adventure",
        pos: { lat: 28.600582998057156, lng: -81.20146960470308 }//library
    },
    {
        id: 6,
        title: 'Pegasus',
        picture: pegasus,
        description: "With its shimmering gold coat and majestic wings, this wild stallion is the ultimate symbol of UCF pride, and it's always ready to take flight for some magical and wacky adventures!",
        pos: { lat: 28.60160681694149, lng: -81.20044675481425 }//dont know exactly where they will be going yet so I just put them at the student union
    },
    {
        id: 9,
        title: 'Squeaky',
        picture: squeaky,
        description: "Meet Squeaky, the quackiest resident of the Reflection Pond! This rubber duck loves to float on its back and soak up the sun, and it's always up for some fun and playful splashing with any passersby who want to join in on the fun.",
        pos: { lat: 28.59966114045313, lng: -81.20186750937363}//Reflection Pond
    },
    {
        id: 10,
        title: 'Sealy',
        picture: sealy,
        description: 'With its bright smile, friendly demeanor, and encyclopedic knowledge of all things UCF, Sealy is the ultimate campus ambassador and always eager to help students navigate their way through college life.',
        pos: { lat: 28.60160681694149, lng: -81.20044675481425 }//Student Union
    },
   
    
    
];

export default monsters;

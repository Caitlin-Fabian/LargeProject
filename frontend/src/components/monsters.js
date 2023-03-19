import citronaut from '../assets/citronaut.png';
import pegasus from '../assets/pegasus.png';
import knightro from '../assets/knightro.png';
import girl from '../assets/girl_character.png';

export const monsters = [
    {
        id: 1,
        title: 'Memory Leech',
        picture: girl,
        description:
            'A creature that feeds on the memories of students who study late at night in the John C. Hitt Library.',
    },
    {
        id: 4,
        title: 'Ruckus Raptor',
        picture: girl,
        description:
            'A mischievous dinosaur that hides in the bushes around the Recreation and Wellness Center, and steals equipment from unsuspecting athletes.',
    },

    {
        id: 6,
        title: 'Knightro',
        picture: knightro,
        description: "UCF's main mascot",
    },
    {
        id: 7,
        title: 'Citronaut',
        picture: citronaut,
        description: "Big ol' orange guy :)",
    },
    {
        id: 8,
        title: 'Pegasus',
        picture: pegasus,
        description: 'Magestic Horse',
    },
];

export default monsters;

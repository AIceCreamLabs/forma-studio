export interface Project {
  id:        number;
  slug:      string;
  name:      string;
  year:      number;
  category:  string;
  location:  string;
  typology:  string;
  desc:      string;
  challenge: string;
  materials: string[];
  sizes:     string[]; // floor areas
  img:       string;
  imgs:      string[];
}

const I = (n: number) => `./img/img${n}.webp`;

export const PROJECTS: Project[] = [
  {
    id: 1, slug: 'vale-house',
    name: 'Vale House', year: 2023,
    category: 'Residential', location: 'Highgate, London',
    typology: 'Private Residence',
    desc: 'A house that negotiates its own disappearance. Cast concrete set into the hillside — form emerging from the cut rather than the fill.',
    challenge: 'The site demanded the building earn its position. Three levels of living arranged around a single light shaft that changes character with the hour.',
    materials: ['In-situ concrete', 'Iroko timber', 'Patinated bronze', 'Carrara marble'],
    sizes: ['320 m²', '4 bedrooms', 'GIA 580 m²'],
    img: I(1), imgs: [I(1), I(2), I(3)],
  },
  {
    id: 2, slug: 'archive-centre',
    name: 'Archive Centre', year: 2022,
    category: 'Cultural', location: 'Copenhagen, Denmark',
    typology: 'Cultural Institution',
    desc: 'A repository for memory. The building organises itself around the act of retrieval — of documents, of ideas, of time.',
    challenge: 'Climate control for 4 million archived items within a civic building that must also be readable from the street as open and welcoming.',
    materials: ['Brick', 'Weathering steel', 'Pale ash', 'Acoustic plaster'],
    sizes: ['4,200 m²', 'Public reading rooms: 800 m²', 'Archive stacks: 1,800 m²'],
    img: I(4), imgs: [I(4), I(5), I(6)],
  },
  {
    id: 3, slug: 'meridian-tower',
    name: 'Meridian Tower', year: 2021,
    category: 'Commercial', location: 'Canary Wharf, London',
    typology: 'Mixed-use Commercial',
    desc: 'Twenty-two floors that read as one gesture. The tower refuses the setback language of its neighbours — instead a single continuous surface from ground to sky.',
    challenge: 'A 150m tower that avoids the visual noise of its context while achieving a 5.5 star NABERS energy rating.',
    materials: ['High-performance glass', 'Anodised aluminium', 'Recycled steel frame', 'Green terrace planting'],
    sizes: ['38,000 m²', '22 floors', 'NABERS 5.5 star'],
    img: I(7), imgs: [I(7), I(8), I(9)],
  },
  {
    id: 4, slug: 'still-water-pavilion',
    name: 'Still Water Pavilion', year: 2020,
    category: 'Civic', location: 'Amsterdam, Netherlands',
    typology: 'Public Pavilion',
    desc: 'A pavilion built to receive water. The roof collects rain, feeds the reflecting pool below — an architecture that works with the Dutch sky.',
    challenge: 'A temporary structure with permanent presence. Designed to be dismantled and rebuilt in a different configuration in three years.',
    materials: ['Cross-laminated timber', 'EPDM roof membrane', 'Reclaimed brick base', 'Corten cladding'],
    sizes: ['420 m²', 'Capacity 180', 'Reflecting pool 260 m²'],
    img: I(10), imgs: [I(10), I(11), I(12)],
  },
  {
    id: 5, slug: 'threshold-school',
    name: 'Threshold School', year: 2019,
    category: 'Cultural', location: 'Marseille, France',
    typology: 'Educational',
    desc: 'A school where every corridor is a classroom. The threshold between inside and outside is deliberately ambiguous — learning happens in the in-between.',
    challenge: 'Mediterranean climate requires passive cooling for a 600-student secondary school with a construction budget of €8.2M.',
    materials: ['Local limestone', 'Brise-soleil brickwork', 'Polished concrete floors', 'Salvaged timber joinery'],
    sizes: ['6,800 m²', '600 students', 'Passive cooling throughout'],
    img: I(2), imgs: [I(2), I(5), I(8)],
  },
];

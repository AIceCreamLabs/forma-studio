export interface ScenePerspective {
  title: string;
  subtitle: string;
  position:
    | 'top'
    | 'top-left'
    | 'left'
    | 'right'
    | 'center'
    | 'top-right'
    | 'bottom'
    | 'bottom-left'
    | 'bottom-right';
  camera: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  scrollProgress: { start: number; end: number };
  hideText?: boolean;
}

export const scenePerspectives: ScenePerspective[] = [
  {
    title:    'FORMA',
    subtitle: 'Est. 2008 · London',
    position: 'center',
    camera:   { x: 0,   y: 2,  z: 10 },
    target:   { x: 0,   y: 5,  z: 0  },
    scrollProgress: { start: 0,    end: 11.9 },
  },
  {
    title:    'STRUCTURE',
    subtitle: 'Where weight meets grace',
    position: 'left',
    camera:   { x: 3,   y: 8,  z: 10 },
    target:   { x: 0,   y: 10, z: 0  },
    scrollProgress: { start: 11.9, end: 23.7 },
  },
  {
    title:    'MATERIAL',
    subtitle: 'Stone, steel, and silence',
    position: 'right',
    camera:   { x: -10, y: 15, z: 0  },
    target:   { x: 0,   y: 15, z: 0  },
    scrollProgress: { start: 23.7, end: 35.6 },
  },
  {
    title:    'LIGHT',
    subtitle: 'The architecture of shadow',
    position: 'top-left',
    camera:   { x: -10, y: 22, z: 0  },
    target:   { x: 0,   y: 25, z: 0  },
    scrollProgress: { start: 35.6, end: 45.8 },
  },
  {
    title:    '',
    subtitle: '',
    position: 'top-right',
    camera:   { x: 5,   y: 35, z: 5  },
    target:   { x: 0,   y: 20, z: 0  },
    scrollProgress: { start: 45.8, end: 52.5 },
    hideText: true,
  },
  {
    title:    'FORM',
    subtitle: 'Nothing added, nothing removed',
    position: 'center',
    camera:   { x: 5,   y: 30, z: 10 },
    target:   { x: 0,   y: 20, z: 0  },
    scrollProgress: { start: 52.5, end: 62.7 },
  },
  {
    title:    'THRESHOLD',
    subtitle: 'The door as the first argument',
    position: 'bottom-right',
    camera:   { x: 5,   y: 25, z: 10 },
    target:   { x: 0,   y: 20, z: 0  },
    scrollProgress: { start: 62.7, end: 69.5 },
  },
  {
    title:    'PERMANENCE',
    subtitle: 'Built to outlast intention',
    position: 'bottom-left',
    camera:   { x: 15,  y: 20, z: 5  },
    target:   { x: 0,   y: 24, z: 0  },
    scrollProgress: { start: 69.5, end: 77.9 },
  },
  {
    title:    'COMMISSION',
    subtitle: 'Every project begins with a conversation',
    position: 'top',
    camera:   { x: 25,  y: 15, z: 0  },
    target:   { x: 0,   y: 20, z: 0  },
    scrollProgress: { start: 77.9, end: 84.7 },
  },
  {
    title:    'ENTER',
    subtitle: 'Explore our work',
    position: 'center',
    camera:   { x: 20,  y: 20, z: -10},
    target:   { x: 0,   y: 20, z: 0  },
    scrollProgress: { start: 84.7, end: 100  },
  },
];

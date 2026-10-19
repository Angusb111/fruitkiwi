# FruitKiwi

FruitKiwi is a community platform for sharing surplus fruit.

It helps people list fruit growing in their gardens that they cannot use themselves, so others nearby can collect it before it goes to waste.

## Features

- **Map-based browsing** — find available fruit in your area.
- **Community listings** — share surplus fruit from your garden.
- **Location-based discovery** — explore listings by neighbourhood.
- **Custom map markers** — identify fruit listings on the map.

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MapLibre GL JS](https://maplibre.org/)
- [LINZ Basemaps](https://basemaps.linz.govt.nz/)

## Getting Started

### Requirements

- Node.js
- npm

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd fruitkiwi
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Vector Graphics

FruitKiwi's visual identity uses vector graphics for logos, icons, map markers, and other brand assets.

Website-ready SVG files are stored in the `public/` directory.

### Inkscape Master File

The editable master artwork is maintained in Inkscape's SVG format.

**[Open the Inkscape master file](./design/fruitkiwi-master.svg)**

The master file is the source of truth for the brand artwork. Export website-ready assets from this file rather than editing exported versions independently.

### Editing and Exporting

1. Open the master SVG in [Inkscape](https://inkscape.org/).
2. Edit the artwork as required.
3. Save the master file.
4. Export individual assets as SVG files.
5. Place website-ready assets in `public/`.

Keep the master artwork editable, with logical layers and named objects where practical.

## Maps

FruitKiwi uses MapLibre GL JS to display interactive maps.

The current basemap uses [LINZ Basemaps](https://basemaps.linz.govt.nz/), providing New Zealand-focused geographic data.

Custom SVG markers can be added to the map at the coordinates of individual fruit listings.

## Project Structure

```text
fruitkiwi/
├── app/
│   ├── components/
│   │   └── Map.tsx
│   ├── page.tsx
│   └── ...
├── design/
│   └── fruitkiwi-master.svg
├── public/
│   ├── wordmark-basic.svg
│   ├── fruit-pin.svg
│   └── maplibre/
├── package.json
└── README.md
```

*This structure is illustrative and should be updated as the project evolves.*

## Contributing

When adding or updating features:

- Keep the interface responsive and accessible.
- Put reusable components in `app/components/`.
- Keep editable brand artwork in `design/`.
- Keep website-ready assets in `public/`.
- Update this README when project setup or structure changes.

## Licence

Add the project's software and artwork licence details here before distributing the project or accepting external contributions.
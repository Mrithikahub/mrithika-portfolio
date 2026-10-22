import { FeaturedGallery } from "./FeaturedGallery";
import { ProjectGrid } from "./ProjectGrid";

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative">
      <FeaturedGallery />
      <ProjectGrid />
    </section>
  );
}

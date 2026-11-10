import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ServicesSphere } from "@/components/home/ServicesSphere";

/*
 * Services introduction, directly below the hero (the hero's scroll arrow
 * targets #home-continue). Composition follows the reference's services
 * block at 1440px: 120px section padding, heading column, a 524px-tall pair
 * of panels 10px apart, and the CTA centred 52px below them. The reference
 * plays no entrance animation on these elements, so neither does this.
 *
 * Heading and statement sizes are set against their own column width
 * (container query units) so the longest word, "experiences." / "Launch.",
 * always fits, capped at the reference sizes (58px / 76px).
 *
 * The sphere follows the reference from 1024px: 201px, centred on the
 * centre panel's lower-left corner and layered behind the panels. Stacked
 * layouts have no clear space there, so it sits opposite the "Services"
 * pill instead, clear of all text.
 */
export function HomeServicesIntro() {
  return (
    <section
      id="home-continue"
      aria-labelledby="home-services-heading"
      className="bg-surface py-[3.75rem] md:py-[6.25rem] lg:py-[7.5rem]"
    >
      <Container>
        <div className="grid gap-8 md:gap-12 lg:grid-cols-[30fr_70fr] lg:gap-16">
          <div className="@container relative flex flex-col items-start gap-[2.375rem] lg:gap-[6.75rem]">
            <ServicesSphere className="absolute right-0 top-[-1.0625rem] size-20 md:top-[-2.59375rem] md:size-32 lg:hidden" />
            <p className="rounded-full border border-border px-3 py-2.5 text-base leading-[1.44] tracking-[-0.02em] text-foreground md:px-4">
              Services
            </p>
            <h2
              id="home-services-heading"
              className="font-display text-[min(2.75rem,calc(100cqi/5.75))] font-medium leading-[1.32] tracking-[-0.04em] text-foreground md:text-[3.25rem] lg:text-[min(3.625rem,calc(100cqi/5.75))]"
            >
              <span className="block">From ideas</span>
              <span className="block">to digital</span>
              <span className="block">experiences.</span>
            </h2>
          </div>

          <div className="flex flex-col gap-10 lg:gap-[3.25rem]">
            <div className="relative grid gap-2.5 md:min-h-[24rem] md:grid-cols-[42fr_28fr] lg:min-h-[32.75rem]">
              <ServicesSphere className="absolute bottom-[-18%] left-[-103px] hidden size-[201px] lg:block" />
              <div className="relative flex flex-col gap-9 rounded-[20px] bg-foreground p-3 pb-8 pl-4 md:p-4 md:pb-10 md:pl-8">
                <div className="relative aspect-[224/178] w-[min(14rem,62%)] self-end overflow-hidden rounded-[14px] bg-[#1a1a1c]">
                  <Image
                    src="/images/home/services-studio.jpg"
                    alt="A code editor beside the website interface it builds"
                    fill
                    sizes="224px"
                    className="object-cover"
                  />
                </div>
                <p className="max-w-[25rem] text-[1.375rem] font-medium leading-[1.32] tracking-[-0.02em] text-[#0f0f0f] md:text-2xl">
                  Aqelvio Labs brings software engineering and thoughtful
                  design together to build websites, applications, and
                  digital tools for businesses and founders.
                </p>
              </div>

              <div className="@container relative flex items-center justify-center rounded-2xl bg-[linear-gradient(160deg,#d7d7da,#b3b3b8)] px-5 py-10 text-center text-[#0f0f0f] md:p-6">
                <div className="flex flex-col items-center gap-[1.125rem]">
                  <p className="font-display text-[min(3.5rem,calc(100cqi/3.7))] font-medium leading-none tracking-[-0.04em] md:text-[min(4.75rem,calc(100cqi/3.7))]">
                    <span className="block">Design.</span>
                    <span className="block">Build.</span>
                    <span className="block">Launch.</span>
                  </p>
                  <p className="max-w-[18rem] text-xl leading-[1.32] tracking-[-0.02em] md:text-2xl">
                    Thoughtful execution, from concept to release.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button href="/services" showArrow>
                Explore our services
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

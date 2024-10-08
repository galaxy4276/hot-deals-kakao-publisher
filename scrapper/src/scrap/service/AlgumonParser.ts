import { Page } from "puppeteer";
import { HotDealDetails } from "@/types";


export default class AlgumonParser {
  private readonly context: Page;

  constructor(context: Page) {
    this.context = context;
  }

  public async getLatestHotDeals(): Promise<HotDealDetails[]> {
    return this.context.evaluate(() => {
      const postList = document.querySelector('.post-list');
      const items = Array.from(postList?.querySelectorAll("li.post-li") || []);

      const getHotDeals = (element: Element) => {
        const getInnerText = (element: Element | null) => (element as HTMLSpanElement | null)?.innerText;
        const getSharedLink = (element: Element | null) =>(element as HTMLAnchorElement | null)?.getAttribute("data-clipboard-text");
        const getIdFromLink = (link: string) =>link.match(/\w+\/\d+$/)?.[0];

        const hotDealsName =  getInnerText(element.querySelector(".product-link")) as string;
        const price = getInnerText(element.querySelector(".product-price"));
        const link = getSharedLink(element.querySelector(".opinion-box > button:last-child")) as string;
        const id = getIdFromLink(link) as string;

        return {
          id,
          name: hotDealsName,
          price,
          link,
          dateCreated: new Date().toISOString(),
        };
      };

      return items.map(getHotDeals);
    });
  }

}

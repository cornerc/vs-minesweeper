import "@/tests/setup.js";
import Vuetify from "vuetify";
import {mount, createLocalVue, Wrapper} from "@vue/test-utils";
import AppHeader from "@/components/molecules/AppHeader.vue";
import {HeaderCenterItems, HeaderRightItems} from "@/components/type";

const localVue = createLocalVue();

describe("AppHeader", () => {
  let vuetify: any;
  let mountWrapper: (options?: object) => Wrapper<Vue>;
  beforeEach(() => {
    vuetify = new Vuetify();
    mountWrapper = (options = {}) => {
      return mount(AppHeader, {
        localVue,
        vuetify,
        ...options,
      });
    };
  });

  it("should be have title by default", () => {
    const wrapper = mountWrapper({
      propsData: {},
    });
    const title = wrapper.find(".v-toolbar__title");
    expect(title.text()).toBe("VSマインスイーパー");

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should be exist center item", () => {
    const headerCenterItems: HeaderCenterItems[] = [
      {
        icon: "mdi-table",
        title: "table",
        content: "table-content",
      },
      {
        icon: "mdi-av-timer",
        title: "time",
        content: "time-content",
      },
    ];
    const wrapper = mountWrapper({
      propsData: {
        headerCenterItems,
      },
    });

    for (let i = 0; i < headerCenterItems.length; i++) {
      const item = headerCenterItems[i];

      const icon = wrapper.find("i." + item.icon);
      expect(icon.exists()).toBe(true);

      const content = wrapper.find(`[title=${item.title}]`);
      expect(content.exists()).toBe(true);
      expect(content.text()).toBe(item.content);

      content.trigger("click");

      const emittedRes = wrapper.emitted();

      expect(emittedRes.clickCenterContent).toBeDefined();
      if (emittedRes.clickCenterContent) {
        expect(emittedRes.clickCenterContent[i][0]).toEqual(item.title);
      }
    }

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should be exist right item", () => {
    const headerRightItems: HeaderRightItems[] = [
      {
        icon: "mdi-information",
        title: "information",
      },
    ];
    const wrapper = mountWrapper({
      propsData: {
        headerRightItems,
      },
    });
    for (let i = 0; i < headerRightItems.length; i++) {
      const item = headerRightItems[i];
      const icon = wrapper.find("i." + item.icon);
      expect(icon.exists()).toBe(true);

      const button = wrapper.find(`[title=${item.title}]`);

      button.trigger("click");

      const emittedRes = wrapper.emitted();

      expect(emittedRes.clickRightContent).toBeDefined();
      if (emittedRes.clickRightContent) {
        expect(emittedRes.clickRightContent[i][0]).toEqual(item.title);
      }
    }

    expect(wrapper.html()).toMatchSnapshot();
  });
});

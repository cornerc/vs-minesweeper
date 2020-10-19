import "@/tests/setup.js";
import Vuetify from "vuetify";
import {mount, createLocalVue} from "@vue/test-utils";
import ConfigDialog from "@/components/molecules/ConfigDialog.vue";
import {Config} from "@/components/type";

const localVue = createLocalVue();

describe("ConfigDialog", () => {
  let vuetify: any;
  beforeEach(() => {
    vuetify = new Vuetify();
  });
  const mountWrapper = (options: object) => {
    return mount(ConfigDialog, {
      localVue,
      vuetify,
      ...options,
    });
  };

  it.skip("hidden", () => {
    const wrapper = mountWrapper({
      propsData: {},
    });
    const dialogContainer = wrapper.find("div.v-dialog__container");
    expect(dialogContainer.exists()).toBe(true);
  });
  it.skip("visible", () => {
    const config: Config = {
      darkTheme: false,
      mine: 40,
      row: 20,
      col: 18,
    };
    const value = true;
    const wrapper = mountWrapper({
      propsData: {config, value},
    });
    const content = wrapper.find("[data-testid='dialog-content']");
    console.log(content.html());
    expect(content.exists()).toBe(true);
  });
});

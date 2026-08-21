// @vitest-environment jsdom
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import type { ReactElement, RefObject } from "react";
import { Avatar } from "./Avatar/Avatar";
import { AvatarGroup } from "./AvatarGroup/AvatarGroup";
import { Badge } from "./Badge/Badge";
import { Card, CardBody, CardFooter, CardHeader } from "./Card/Card";
import { Chip } from "./Chip/Chip";
import { ChipBar } from "./Chip/ChipBar";
import { ChipGroup } from "./Chip/ChipGroup";
import { CountButton } from "./CountButton/CountButton";
import { Divider } from "./Divider/Divider";
import { Icon } from "./Icon/Icon";
import { Link } from "./Link/Link";
import { ListGroup, ListItem } from "./List/List";
import { ProgressBar } from "./ProgressBar/ProgressBar";
import { Skeleton } from "./Skeleton/Skeleton";
import { Spinner } from "./Spinner/Spinner";
import { Tab, TabList, TabPanel, Tabs } from "./Tabs/Tabs";
import { Tag } from "./Tag/Tag";

/* A component that spreads the rest onto an element promises the caller that
   element. React 19 carries a ref through the rest on its own, so the failure
   this guards is at the type level: a props type extending HTMLAttributes has
   no `ref`, and the caller who needs one — a popover anchor, a scroll target,
   an observer — is refused at the call site and wraps the component in a spare
   div instead. `tsc` proves the prop exists; the assertion proves it reaches
   the element the component says it does, including down each branch of the
   components that pick their own tag. */
type Case = [name: string, node: ReactElement, ref: RefObject<HTMLElement | null>, tag: string];

const at = <T extends HTMLElement>(
  name: string,
  build: (ref: RefObject<T | null>) => ReactElement,
  tag: string,
): Case => {
  const ref = createRef<T>();
  return [name, build(ref), ref, tag];
};

const cases: Case[] = [
  at<HTMLSpanElement>("Avatar", (ref) => <Avatar name="Ada Lovelace" ref={ref} />, "SPAN"),
  at<HTMLDivElement>("AvatarGroup", (ref) => <AvatarGroup ref={ref}>{null}</AvatarGroup>, "DIV"),
  at<HTMLSpanElement>("Badge", (ref) => <Badge ref={ref}>3</Badge>, "SPAN"),
  at<HTMLElement>("Card", (ref) => <Card ref={ref}>body</Card>, "DIV"),
  at<HTMLElement>("Card as a link", (ref) => <Card href="/x" ref={ref}>body</Card>, "A"),
  at<HTMLElement>("Card as a button", (ref) => <Card onClick={() => {}} ref={ref}>body</Card>, "BUTTON"),
  at<HTMLDivElement>("CardHeader", (ref) => <CardHeader ref={ref} />, "DIV"),
  at<HTMLDivElement>("CardBody", (ref) => <CardBody ref={ref} />, "DIV"),
  at<HTMLDivElement>("CardFooter", (ref) => <CardFooter ref={ref} />, "DIV"),
  at<HTMLElement>("Chip", (ref) => <Chip ref={ref}>All</Chip>, "SPAN"),
  at<HTMLElement>("Chip with an onClick", (ref) => <Chip onClick={() => {}} ref={ref}>All</Chip>, "BUTTON"),
  at<HTMLDivElement>("ChipBar", (ref) => <ChipBar ref={ref}>{null}</ChipBar>, "DIV"),
  at<HTMLDivElement>("ChipGroup", (ref) => <ChipGroup ref={ref}>{null}</ChipGroup>, "DIV"),
  at<HTMLButtonElement>("CountButton", (ref) => <CountButton icon={null} label="Likes" ref={ref}>2</CountButton>, "BUTTON"),
  at<HTMLDivElement>("Divider", (ref) => <Divider ref={ref} />, "DIV"),
  at<HTMLSpanElement>("Icon", (ref) => <Icon name="pin" ref={ref} />, "SPAN"),
  at<HTMLAnchorElement>("Link", (ref) => <Link href="/x" ref={ref}>terms</Link>, "A"),
  at<HTMLUListElement>("ListGroup", (ref) => <ListGroup ref={ref}>{null}</ListGroup>, "UL"),
  at<HTMLElement>("ListItem", (ref) => <ListItem title="Row" ref={ref} />, "DIV"),
  at<HTMLDivElement>("ProgressBar", (ref) => <ProgressBar label="Upload" value={50} ref={ref} />, "DIV"),
  at<HTMLSpanElement>("Skeleton", (ref) => <Skeleton ref={ref} />, "SPAN"),
  at<HTMLSpanElement>("Spinner", (ref) => <Spinner ref={ref} />, "SPAN"),
  at<HTMLDivElement>("TabList", (ref) => <TabList label="Views" ref={ref}>{null}</TabList>, "DIV"),
  at<HTMLButtonElement>("Tab", (ref) => <Tab value="a" ref={ref}>A</Tab>, "BUTTON"),
  at<HTMLDivElement>("TabPanel", (ref) => <TabPanel value="a" ref={ref}>content</TabPanel>, "DIV"),
  at<HTMLSpanElement>("Tag", (ref) => <Tag ref={ref}>draft</Tag>, "SPAN"),
];

/* A tab reads its selection off the context Tabs provides. */
const inTabs = new Set(["TabList", "Tab", "TabPanel"]);

describe("every component hands back the element it spreads onto", () => {
  it.each(cases)("%s", (name, node, ref, tag) => {
    render(
      inTabs.has(name) ? (
        <Tabs value="a" onChange={() => {}}>
          {node}
        </Tabs>
      ) : (
        node
      ),
    );
    expect(ref.current?.tagName).toBe(tag);
  });
});

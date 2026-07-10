import { describe, it, expect } from "vitest";
import { renderMarkdown } from "@/lib/markdown";
import React from "react";

type TestElement = React.ReactElement<Record<string, unknown>>;

describe("Markdown Parser Utility", () => {
  it("should render paragraphs for basic text", () => {
    const nodes = renderMarkdown("Hello World");
    expect(nodes.length).toBe(1);
    const pNode = nodes[0] as TestElement;
    expect(pNode.type).toBe("p");
  });

  it("should parse bold tags", () => {
    const nodes = renderMarkdown("Hello **World**");
    const pNode = nodes[0] as TestElement;
    const children = React.Children.toArray(pNode.props.children as React.ReactNode);

    expect(children.length).toBe(2);
    expect(children[0]).toBe("Hello ");

    const strongNode = children[1] as TestElement;
    expect(strongNode.type).toBe("strong");
    expect(strongNode.props.children).toBe("World");
  });

  it("should parse link tags", () => {
    const nodes = renderMarkdown("[Enggi](https://enggipratama.my.id)");
    const pNode = nodes[0] as TestElement;
    const children = React.Children.toArray(pNode.props.children as React.ReactNode);

    const linkNode = children.find(
      (c) => typeof c === "object" && (c as TestElement).type === "a"
    ) as TestElement;

    expect(linkNode).toBeDefined();
    expect(linkNode.props.href).toBe("https://enggipratama.my.id");
    expect(linkNode.props.children).toBe("Enggi");
  });

  it("should render list items", () => {
    const nodes = renderMarkdown("- Item 1\n- Item 2");
    expect(nodes.length).toBe(1);
    const ulNode = nodes[0] as TestElement;
    expect(ulNode.type).toBe("ul");

    const liItems = React.Children.toArray(ulNode.props.children as React.ReactNode) as TestElement[];
    expect(liItems.length).toBe(2);
    expect(liItems[0].type).toBe("li");
  });
});

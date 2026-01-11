"use client";
import { AnimatedTooltip } from "./ui/animated-tooltip";
const icons = [
  {
    id: 1,
    name: "NextJs",
    designation: "Framework",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.KhEi6z8wYQZVa0IFYmaUXAHaHa?pid=ImgDet&w=178&h=178&c=7&o=7&rm=3",
  },
  {
    id: 2,
    name: "Laravel",
    designation: "Framework",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.th5dfjZNM2mMAGs3aNRfUgAAAA?pid=ImgDet&w=150&h=150&c=7&o=7&rm=3",
  },
  {
    id: 3,
    name: "TypeScript",
    designation: "Programming Language",
    image:
      "data:image/webp;base64,UklGRlIFAABXRUJQVlA4IEYFAACQIgCdASq6ALoAPp1MoUqlv6OhqhcYa/ATiU3cLc4ZS4P8l3GW5uj8pQNv67zJ5FvUb5Q3QZ8ynnFek3/Gb9RvROQy+U/7daaxgVpssXSpsx7yL0Rwg4/fEUc2uumPino7TcfeeADLMnKS09Tk9wgJTIHaWJ7hASmPnyKpWQEpkDtLETy37KHKRvfstddB8+cBPiIEBKZZcDJE6iBLnpts64yZauWnyRNs+LWfbBwyTuE0Um4K5xzQfLBjUQsMA+pAyVj+JtRTJ0IYajxwHDXK4qv6bJFN/yNuVYWh0CZHeoTwNs6GgFFPP+6jH9Hafr5VtOP50sG/nArXYHuJMTCeyVklx6PgHg9w4ic0+EnCEDTuG92HoF2s0WGkksAA/rwtw5glugjSiZ2vuWdq7joBodV/kbYgyOKZLYRKAYdWonhGv8c6GmLWbwiA1lbD2CpEPoecvD9asSgFgPj+sMs0kR87DZNlsNLf4H99C0z6GGLcF0AJQIpUy45lQZLR20hK4sSjV0DSvZiI8KyqJWeRSAbBQA9hYAAAAAACu3SvvmfMJEGwxwOi+kTTGz6uUfO2Leep1BCWLnY5whVx0RWiLhwgM0kyWB6s2LwUgzBj/mS5cfoLWhyjo7EiE0GV5W0wPuAH+Pg4DodIz5VhXMQansdi++KLAQ5AVjKhJF8MMrjCEaj5DKO3fuL3druNQoyjNAGr43XPWY+GrOawxTMAyHtU78prdPaonIBuWWvdcV0kBfNWLL0KAKD5NZ6PT9gK0A7AApvWl3/Ce3NkxMUqTx3/g/gIKgkfQ1uuBfZDDYu3oDjtsIZH46+TProkJ3UpKbj1+rBNLYNtjaiV+emAvm8rotpznpcw8PEbgSZrri5Ps2bXmkS0R2JAv64OoAf0WPdp0/4RnTAxIExBSqkQJPfIVd9NhfYBIOFKN8GHnpe69zeXNTyQGsNoG7RxDz0XTUtWdtelLMSLnRv+ypj/mY9SFS5qwURNRSLsbUoOfHAIRww6z8hM47sdpJQmsxLw0WxmGZK08nlVUPQ0DXtUu+o5vgG5I3fgAnwTgu25c2aD5ZEcvS5qOipN/VKTNHHrwiAMmVlGq6KV/sQ0SyLwj3GAyWWGJRLo5Z78XePNJ8v7FGkxWlgtojYxurbwqtYKM89sOdfKYPi/T5Omg5qaNGWvOCaxCJfiPgyUN1H3p/Tb6bmlJqbDWIKaFwY9ZwVx8iPEJ5EAL87H3Pwpav/d6TxDcur43gF0rBZEoL8snQ82nzqUe7Pz1DLBrLmy4lFMTznF+RkkXSGeSNHDDyHEC2DiTh2c0BNTZJXWjsFNHX1n8C58q3agG+okz2ZG3k0vNMit1y9rPe0PAHVMfo9xJPnJoJWiu7tfU+ja1o/2ZTgS8uu4EkcohuztXK9pFeE6ffyhnoXOtmED0QtZQel3Fx4X41ct3kMTAWqKysXuNbrnSut54Xs3KAks9+2H8cDw3B36plnkKgFR2C/C88oBYCouoawkEcKWVN9EuMeUSSxM+2RpdcRo5cjUKOfKM8sz88F68WRWBwfNlsOQWk4H/z0F0hC0WYSMWQyfeozK0Lq712UFmAAeLAQAxBz5d9HdgtZJYIp0Y5nzbQqC6A+kmget68pJo9HypNiIlBP1JIpRh7sBfQ+AdFWM3T32hMDIquH/rF8nMMxs/pvoyYeJbf0U6VIwMH3IetlH4h2p5/0SgeATFhcU1ulXhY3JX9qPwP9C33/6XJqfHMKWnOWnJYQ36DJxa8QPDMb7HCIOTpasaIRAeBe0ny+1jVUCFz1Uop7AAAA=",
  },
  {
    id: 4,
    name: "PHP",
    designation: "Programming Language",
    image:
      "data:image/webp;base64,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",
  },
  {
    id: 5,
    name: "Tailwind",
    designation: "CSS Framework",
    image:
      "https://th.bing.com/th/id/OIP.xAR13OS8OHLlMbRTYQ3a2gAAAA?w=169&h=184&c=7&r=0&o=7&pid=1.7&rm=3",
  },
  {
    id: 6,
    name: "Git",
    designation: "Version Control System",
    image:
      "https://th.bing.com/th?q=Git+Logo+Transparent+PNG&w=120&h=120&c=1&rs=1&qlt=70&o=7&cb=1&pid=InlineBlock&rm=3&mkt=en-ID&cc=ID&setlang=en&adlt=strict&t=1&mw=247",
  },
];

export function AnimatedTooltipPreview() {
  return (
    <div className="flex flex-row items-center justify-center mb-10 mt-10 w-full">
      <AnimatedTooltip items={icons} />
    </div>
  );
}

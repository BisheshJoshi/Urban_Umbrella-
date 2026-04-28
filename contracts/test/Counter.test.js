import { describe, it } from "node:test";
import { expect } from "chai";
import hre from "hardhat";

describe("Counter", function () {
  it("Should increment and decrement the counter", async function () {
    const Counter = await hre.ethers.getContractFactory("Counter");
    const counter = await Counter.deploy();

    expect(await counter.count()).to.equal(0);

    const incrementTx = await counter.increment();
    await incrementTx.wait();

    expect(await counter.count()).to.equal(1);

    const decrementTx = await counter.decrement();
    await decrementTx.wait();

    expect(await counter.count()).to.equal(0);
  });
});

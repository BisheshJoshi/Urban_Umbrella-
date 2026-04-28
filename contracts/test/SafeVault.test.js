import assert from "node:assert/strict";
import test from "node:test";

import { network } from "hardhat";

test("SafeVault: allows deposit and withdraw", async () => {
  const { ethers } = await network.connect();
  const [owner, alice] = await ethers.getSigners();
  const vault = await ethers.deployContract("SafeVault", [owner.address]);

  await vault.connect(alice).deposit({ value: ethers.parseEther("1") });
  await vault.connect(alice).withdraw(ethers.parseEther("0.4"));

  assert.equal(await vault.balanceOf(alice.address), ethers.parseEther("0.6"));
});

test("SafeVault: blocks reentrancy", async () => {
  const { ethers } = await network.connect();
  const [owner, attacker] = await ethers.getSigners();
  const vault = await ethers.deployContract("SafeVault", [owner.address]);

  const reenterer = await ethers.deployContract("Reenterer", [vault.target], attacker);

  await reenterer.deposit({ value: 10n });
  let reverted = false;
  try {
    await reenterer.attackWithdraw(5n);
  } catch {
    reverted = true;
  }
  assert.equal(reverted, true);
});

test("SafeVault: pauses deposits", async () => {
  const { ethers } = await network.connect();
  const [owner, alice] = await ethers.getSigners();
  const vault = await ethers.deployContract("SafeVault", [owner.address]);

  await vault.pause();
  let reverted = false;
  try {
    await vault.connect(alice).deposit({ value: 1n });
  } catch {
    reverted = true;
  }
  assert.equal(reverted, true);
});

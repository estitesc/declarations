const { assert } = require("chai");

const Redeclarations = artifacts.require("./Redeclarations.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Redeclarations", ([deployer, minter]) => {
  let redeclarations;

  const exampleIndices = [
    [10, 15],
    [20, 25],
    [30, 34],
  ];

  const altIndices = [
    [12, 13],
    [20, 29],
    [33, 35],
  ];

  const alternateIndices = [
    [12, 13],
    [20, 29],
    [33, 34],
  ];

  const anotherIndices = [
    [13, 15],
    [20, 30],
    [33, 34],
  ];

  before(async () => {
    redeclarations = await Redeclarations.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await redeclarations.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
  });

  describe("redeclarations", async () => {
    let result, customEvent, updateResult, publicMintCount;

    before(async () => {
      result = await redeclarations.publicMint(
        "https://sonn3t.com/disclaimed_witch.png",
        JSON.stringify(exampleIndices),
        { from: minter }
      );
      publicMintCount = await redeclarations.publicMintCount();
      const systemMintEvent = result.logs[0].args;
      customEvent = result.logs[1].args;

      updateResult = await redeclarations.updateToken(
        customEvent.id.toNumber(),
        "https://sonn3t.com/disclaimed_frog.png",
        JSON.stringify(exampleIndices),
        { from: deployer }
      );
    });

    it("mints a redeclaration", async () => {
      assert.equal(publicMintCount, 1);

      assert.equal(
        customEvent.id.toNumber(),
        publicMintCount.toNumber() - 1,
        "id is correct"
      );
      assert.equal(customEvent.minter, minter, "owner is correct");
      assert.equal(
        customEvent.indices,
        JSON.stringify(exampleIndices),
        "indicies are correct"
      );

      assert.equal(
        customEvent.imageUrl,
        "https://sonn3t.com/disclaimed_witch.png",
        "Image URL is correct"
      );
    });

    it("prevents a duplicate mint", async () => {
      await await redeclarations.publicMint(
        "https://sonn3t.com/disclaimed_witch.png",
        JSON.stringify(exampleIndices),
        { from: minter }
      ).should.be.rejected;
    });

    it("can be edited by contract deployer", async () => {
      const updateEvent = updateResult.logs[0].args;
      assert.equal(
        updateEvent.imageUrl,
        "https://sonn3t.com/disclaimed_frog.png",
        "Updated Image URL is correct in event"
      );

      token = await redeclarations.declarations(customEvent.id.toNumber());
      assert.equal(
        token.imageUrl,
        "https://sonn3t.com/disclaimed_frog.png",
        "Updated token actually holds correct Image URL"
      );
    });

    it("prevents edits from non-owners", async () => {
      await await redeclarations.updateToken(
        customEvent.id.toNumber(),
        "https://sonn3t.com/disclaimed_pigeon.png",
        JSON.stringify(exampleIndices),
        { from: minter }
      ).should.be.rejected;
    });
  });

  describe("owner mint", async () => {
    let result, ownerMintCount;

    before(async () => {
      await redeclarations.publicMint(
        "https://sonn3t.com/disclaimed_witch.png",
        JSON.stringify(altIndices),
        { from: minter }
      );
      result = await redeclarations.ownerMint(
        "https://sonn3t.com/pfps/pfp_5.png",
        JSON.stringify(alternateIndices),
        { from: deployer }
      );

      publicMintCount = await redeclarations.publicMintCount();
      ownerMintCount = await redeclarations.ownerMintCount();
    });

    it("owner mints a redeclaration", async () => {
      assert.equal(ownerMintCount, 1);
      const ownerMintEvent = result.logs[0].args;
      const ownerCustomEvent = result.logs[1].args;
      assert.equal(
        ownerCustomEvent.id.toNumber(),
        ownerMintCount.toNumber() + publicMintCount.toNumber() - 1,
        "id is correct"
      );
      assert.equal(ownerCustomEvent.minter, deployer, "owner is correct");
      assert.equal(
        ownerCustomEvent.indices,
        JSON.stringify(alternateIndices),
        "indicies are correct"
      );

      assert.equal(
        ownerCustomEvent.imageUrl,
        "https://sonn3t.com/pfps/pfp_5.png",
        "Image URL is correct"
      );
    });

    it("cant be called by non-owner", async () => {
      await await redeclarations.ownerMint(
        "https://sonn3t.com/pfps/pfp_5.png",
        JSON.stringify(anotherIndices),
        { from: minter }
      ).should.be.rejected;
    });

    it("prevents a duplicate owner mint", async () => {
      await await redeclarations.ownerMint(
        "https://sonn3t.com/pfps/pfp_5.png",
        JSON.stringify(alternateIndices),
        { from: deployer }
      ).should.be.rejected;
    });
  });
});

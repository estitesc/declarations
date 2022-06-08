const { assert } = require("chai");

const DeclTest1 = artifacts.require("./DeclTest1.sol");

require("chai").use(require("chai-as-promised")).should();

contract("DeclTest1", ([deployer, minter]) => {
  let declTest;

  const exampleIndices = [
    [10, 15],
    [20, 25],
    [30, 34],
  ];

  before(async () => {
    declTest = await DeclTest1.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await declTest.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
  });

  describe("declarations", async () => {
    let result, publicMintCount;

    before(async () => {
      result = await declTest.mint(
        "https://sonn3t.com/disclaimed_witch.png",
        exampleIndices,
        { from: minter }
      );
      publicMintCount = await declTest.publicMintCount();
    });

    it("mints a declaration", async () => {
      assert.equal(publicMintCount, 1);
      const mintEvent = result.logs[0].args;
      const customEvent = result.logs[1].args;
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
      await await declTest.mint(
        "https://sonn3t.com/disclaimed_witch.png",
        exampleIndices,
        { from: minter }
      ).should.be.rejected;
    });
  });
});

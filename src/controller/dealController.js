import { Deal } from "../schema/deal";
import { Participators } from "../schema/participators";
import { User } from "../schema/user";

///create deal
export const create = async (req, res, next) => {
  try {
    const deal = new Deal(req.body);
    await deal.save();
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Deal created successfully!",
      deal: deal,
    });
  } catch (error) {
    next(error);
    res.status(500).json({ code: 500, status: "Error", error });
  }
};

///join
export const join = async (req, res, next) => {
  try {
    const deal = await Deal.findById({ _id: req.body.dealId });
    if (deal.ownerId.toString() === req.body.userId) {
      res.status(400).json({
        code: 400,
        status: "Error",
        message: "You can not join your own deal!",
      });
    } else {
      const participator = await Participators.create(req.body);
      deal.participators.push(participator._id);
      await deal.save();
      res.status(200).json({
        code: 200,
        status: "Success",
        message: "Join deal successfully!",
      });
    }
  } catch (error) {
    next(error);
    res.status(500).json({ code: 500, status: "Error", error });
  }
};

///deals list
export const dealsList = async (req, res, next) => {
  try {
    const deals = await Deal.find({}).populate(['ownerId', 'participators']);
    if (!deals) {
      res.status(404).json({
        code: 404,
        status: "Error",
        message: "No deal found!",
      });
    } else {
      res.status(200).json({
        code: 200,
        status: "Success",
        message: "Deal list fetched successfully!",
        deals,
      });
    }
  } catch (error) {
    next(error);
    res.status(500).json({ code: 500, status: "Error", error });
  }
};

///get deal
export const getDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findById({ _id: req.body.dealId });
    if (!deal) {
      res.status(404).json({
        code: 404,
        status: "Error",
        message: "No deal found!",
      });
    } else {
      res.status(200).json({
        code: 200,
        status: "Success",
        message: "Deal fetched successfully!",
        deal,
      });
    }
  } catch (error) {
    next(error);
    res.status(500).json({ code: 500, status: "Error", error });
  }
};

//get participator
export const getParticipator = async (req, res, next) => {
  try {
    const participator = await Participators.find({
      $and: [{ userId: req.body.userId }, { dealId: req.body.dealId }],
    });
    if (participator.length === 0) {
      res.status(404).json({
        code: 404,
        status: "Error",
        message: "No participation found!",
      });
    } else {
      res.status(200).json({
        code: 200,
        status: "Success",
        message: "Participator fetched successfully!",
        participator,
      });
    }
  } catch (error) {
    next(error);
    res.status(500).json({ code: 500, status: "Error", error });
  }
};

//get claim deals

// export const getClaimdDeals = async (req, res, next) => {
//   try {
//     const calimDeals = await Deal.find({
//       dealEndTime: { $lt: new Date() },
//     })
//     if (calimDeals.length === 0) {
//       res.status(404).json({
//         code: 404,
//         status: "Error",
//         message: "No deal found!",
//       });
//     } else {
//       res.status(200).json({
//         code: 200,
//         status: "Success",
//         message: "Claimed deals fetched successfully!",
//         calimDeals,
//       });
//     }
//   } catch (error) {
//     next(error);
//     res.status(500).json({ code: 500, status: "Error", error });
//   }
// };

// deleted claimed deal

export const deleteClaimDeal = async (req, res, next) => {
  try {
    await Deal.findByIdAndDelete({ _id: req.body.dealId });
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Claimed deal deleted successfully!",
    });
  } catch (error) {
    next(error);
    res.status(500).json({ code: 500, status: "Error", error });
  }
};

///make favDeal
export const makeFavDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findById({ _id: req.body.dealId });
    const user = await User.findById({ _id: req.body.userId });
    if (
      !deal.favoriteBy.includes(req.body.userId) &&
      !user.favDeals.includes(req.body.dealId)
    ) {
      await Deal.updateOne(
        { _id: req.body.dealId },
        { $push: { favoriteBy: req.body.userId } }
      );
      await User.updateOne(
        { _id: req.body.userId },
        { $push: { favDeals: req.body.dealId } }
      );
    } else if (req.body.fav === true) {
      await Deal.updateOne(
        { _id: req.body.dealId },
        { $push: { favoriteBy: req.body.userId } }
      );
      await User.updateOne(
        { _id: req.body.userId },
        { $push: { favDeals: req.body.dealId } }
      );
    } else if (req.body.fav === false) {
      await Deal.updateOne(
        { _id: req.body.dealId },
        { $pull: { favoriteBy: req.body.userId } }
      );
      await User.updateOne(
        { _id: req.body.userId },
        { $pull: { favDeals: req.body.dealId } }
      );
    }
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Updated successfully!",
    });
  } catch (error) {
    next(error);
    res.status(500).json({ code: 500, status: "Error", error });
  }
};

//list favDeal

export const getFavDealsList = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body.userId }).populate({
      path: "favDeals",
      populate: { path: "ownerId" },
    });
    if (!user) {
      res.status(404).json({
        code: 404,
        status: "Error",
        message: "No deal found!",
      });
    } else {
      res.status(200).json({
        code: 200,
        status: "Success",
        message: "Deal fetched successfully!",
        favDeals: user.favDeals,
      });
    }
  } catch (error) {
    next(error);
    res.status(500).json({ code: 500, status: "Error", error });
  }
};

///delete claimed deal
export const DeleteClaimedDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findByIdAndDelete({ _id: req.body.dealId });
    if (!deal) {
      res.status(404).json({
        code: 404,
        status: "Error",
        message: "No deal found!",
      });
    } else {
      res.status(200).json({
        code: 200,
        status: "Success",
        message: "Deal deleted successfully!",
        deal,
      });
    }
  } catch (error) {
    next(error);
    res.status(500).json({ code: 500, status: "Error", error });
  }
};

///get update deal
export const updateDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findById({ _id: req.body.dealId });
    if (!deal) {
      res.status(404).json({
        code: 404,
        status: "Error",
        message: "No deal found!",
      });
    } else {
      const saveData = req.body
      deal.coinName = saveData.dealName || deal.coinName
      deal.dealEndTime = saveData.expirationDate || deal.dealEndTime
      deal.targetPrice = saveData.maxPrice || deal.targetPrice
      deal.save()
      res.status(200).json({
        code: 200,
        status: "Success",
        message: "Deal updated successfully!",
        deal,
      });
    }
  } catch (error) {
    next(error);
    res.status(500).json({ code: 500, status: "Error", error });
  }
};
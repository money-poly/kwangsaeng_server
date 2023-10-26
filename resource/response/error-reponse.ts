
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class ErrorResponse {
  constructor() {}

  public notAuthorization() {
    throw new HttpException({ token: 'not authorization' }, 401);
  }

  public notAuthorizationLogin() {
    throw new HttpException({ token: 'userIdx가 유효하지 않습니다.' }, 402);
  }

  public notAuthorizationKakao() {
    throw new HttpException({ token: 'not authorization kakao login' }, 403);
  }

  public notAuthorizationApple() {
    throw new HttpException({ token: 'not authorization apple login' }, 404);
  }

  public notExistUser() {
    throw new BadRequestException({
      statusCode: 2000,
      message: '존재하지 않는 유저입니다.',
      result: { userIdx: '' },
    });
  }

  public duplicateByEmail() {
    throw new BadRequestException({
      statusCode: 2001,
      message: '이미 존재하는 이메일입니다.',
      result: { userIdx: '' },
    });
  }

  public duplicateByNickname() {
    throw new BadRequestException({
      statusCode: 2002,
      message: '이미 존재하는 닉네임입니다.',
      result: { userIdx: '' },
    });
  }

  public duplicateByPhone() {
    throw new BadRequestException({
      statusCode: 2003,
      message: '이미 존재하는 핸드폰 번호입니다.',
      result: { userIdx: '' },
    });
  }

  public notExistFCM() {
    throw new BadRequestException({
      statusCode: 2004,
      message: 'fcmToken이 존재하지 않습니다.',
      result: { fcmTokens: {} },
    });
  }

  public notExistPassword() {
    throw new BadRequestException({
      statusCode: 2005,
      message: '비밀번호가 존재하지 않습니다.',
      result: { password: '' },
    });
  }

  public comparePassword(existPassword) {
    throw new BadRequestException({
      statusCode: 2006,
      message: '비밀번호가 일치하지 않습니다.',
      result: { existPassword: existPassword },
    });
  }

  //Review
  public notExistReview(existReviewId) {
    throw new BadRequestException({
      statusCode: 2007,
      message: '존재하는 리뷰가 없습니다.',
      result: { reviewIdx: '' },
    });
  }

  //Post
  public notExistPost(existPostId) {
    throw new BadRequestException({
      statusCode: 2008,
      message: '존재하는 게시물이 없습니다.',
      result: { postIdx: '' },
    });
  }

  //Comment

  public notExistCommnet(existCommentId) {
    throw new BadRequestException({
      statusCode: 2009,
      message: '존재하는 댓글이 없습니다.',
      result: { commentIdx: '' },
    });
  }

  public exceedContentLength() {
    throw new BadRequestException({
      statusCode: 2010,
      message: `content가 제한 글자수 100자를 초과했습니다.`,
      result: {
        restaurantName: '',
        openTime: '',
        closeTime: '',
        telNum: '',
        restaurantIntro: '',
        image: [],
      },
    });
  }

  public userPostNotFound() {
    throw new BadRequestException({
      statusCode: 2011,
      message: '해당 유저의 게시물이 존재하지 않습니다.',
      result: [
        {
          userIdx: null,
          category: '',
          title: '',
          content: '',
          likeNum: null,
          viewNum: null,
          postIdx: null,
          createAt: '',
          updatedAt: '',
          nickName: '',
          imagePath: [],
          commentList: [],
        },
      ],
    });
  }

  public categoryPostsNotFound() {
    throw new BadRequestException({
      statusCode: 2012,
      message: '해당 카테고리의 게시물이 존재하지 않습니다.',
      result: [
        {
          userIdx: null,
          category: '',
          title: '',
          content: '',
          likeNum: null,
          viewNum: null,
          postIdx: null,
          createAt: '',
          updatedAt: '',
          nickName: '',
          imagePath: [],
          commentList: [],
        },
      ],
    });
  }

  public maxPostsExceeded() {
    throw new BadRequestException({
      statusCode: 2013,
      message: '전체 게시물 수를 초과하여 조회할 수 없습니다.',
      result: [
        {
          userIdx: null,
          category: '',
          title: '',
          content: '',
          likeNum: null,
          viewNum: null,
          postIdx: null,
          createAt: '',
          updatedAt: '',
          nickName: '',
          imagePath: [],
          commentList: [],
        },
      ],
    });
  }

  public postNotFound() {
    throw new BadRequestException({
      statusCode: 2014,
      message: 'postIdx에 해당하는 게시물이 없습니다.',
      result: {
        userIdx: null,
        category: '',
        title: '',
        content: '',
        likeNum: null,
        viewNum: null,
        postIdx: null,
        createAt: '',
        updatedAt: '',
        nickName: '',
        imagePath: [],
        commentList: [],
      },
    });
  }

  public likeNotFound() {
    throw new BadRequestException({
      statusCode: 2015,
      message: '해당 게시물에 좋아요를 누르지 않은 유저입니다.',
      result: {
        userIdx: null,
        category: '',
        title: '',
        content: '',
        likeNum: null,
        viewNum: null,
        postIdx: null,
        createAt: '',
        updatedAt: '',
        nickName: '',
        imagePath: [],
        commentList: [],
      },
    });
  }

  //COMMENT
  public notFoundPost() {
    throw new BadRequestException({
      statusCode: 2016,
      message: '존재하지 않는 게시물입니다.',
      result: {
        commentIdx: null,
        postIdx: null,
        userIdx: null,
        parentCommentIdx: null,
        depth: null,
        commentAt: '',
        commentContent: '',
        isDeleted: null,
      },
    });
  }

  public notFoundComment() {
    throw new BadRequestException({
      statusCode: 2017,
      message: '해당 게시물의 댓글이 존재하지 않습니다.',
      result: [
        {
          commentIdx: null,
          postIdx: null,
          userIdx: null,
          parentCommentIdx: null,
          depth: null,
          commentAt: '',
          commentContent: '',
          isDeleted: null,
        },
      ],
    });
  }

  public notFoundSearch() {
    throw new BadRequestException({
      statusCode: 2018,
      message: '검색 결과가 존재하지 않습니다.',
      result: { menuList: [] },
    });
  }

  public notFoundReview() {
    throw new BadRequestException({
      statusCode: 2019,
      message: '리뷰가 존재하지 않습니다.',
      result: {
        reviewIdx: null,
        content: '',
        commentIdx: null,
        createdAt: '',
        updatedAt: '',
      },
    });
  }

  public notRestaurantOwner() {
    throw new BadRequestException({
      statusCode: 2020,
      message: '사장님으로 등록된 유저가 아닙니다.',
      result: {
        reviewIdx: null,
        content: '',
        commentIdx: null,
        createdAt: '',
        updatedAt: '',
      },
    });
  }

  public onlyOwnerCanAccess(result: any) {
    throw new BadRequestException({
      statusCode: 2021,
      message: '해당 가게 사장님만 리뷰 댓글에 접근할 수 있습니다.',
      result,
    });
  }

  public alreadyExistingCommentError() {
    throw new BadRequestException({
      statusCode: 2022,
      message: '해당 리뷰에 이미 사장님 댓글이 존재합니다.',
      result: {
        reviewIdx: null,
        content: '',
        commentIdx: null,
        createdAt: '',
        updatedAt: '',
      },
    });
  }

  public notFoundReviewComment(result: any) {
    throw new BadRequestException({
      statusCode: 2023,
      message: '해당 댓글이 존재하지 않습니다.',
      result,
    });
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import MyCalendar from './MyCalendar';
import {
  getUser,
  getAllUsers,
  saveDiaryAnswers,
  getDiaryAnswers,
  getAllDiaryDates,
} from '../../actions/user';
import { loadUser } from '../../actions/auth';

import { OCAlertsProvider } from '@opuscapita/react-alerts';
import { OCAlert } from '@opuscapita/react-alerts';

import './MentalCalendar.scss';

const DATE_FORMAT = 'DD/MM/YYYY';
const DATE_FORMAT_WITH_TIME = 'h:mm A DD/MM/YYYY';

class MentalCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(
        moment().millisecond(0).seconds(0).second(0).minute(0).hour(0)
      ),
      selectedUser: null,
      diaryQuestions: [
        'Hôm nay tâm trạng của mình như thế nào?',
        'Những điều gì làm mình lo lắng hôm nay?',
        'Mình đã làm gì tốt cho cơ thể của mình hôm nay?',
        'Mình đã làm gì để đầu óc được thư giản và vui vẻ hôm nay?',
        'Ai là nguời mà đã giúp mình cảm thấy an toàn và thoải mái khi ở gần bên ngày hôm nay?',
      ],
      totalDiaryQuestions: 5,
      answeredQuestions: 0,
      formStarted: false,
      diaryAnswers: ['', '', '', '', ''],
    };
  }
  async componentDidMount() {
    this.props.getAllUsers();
    await this.props.loadUser();
    if (this.props.auth && this.props.auth.user) {
      this.setState({ selectedUser: this.props.auth.user });
      this.props.getAllDiaryDates(this.props.auth.user._id);
    }
  }

  changeSelectedUser = async (userId) => {
    let myDate = moment(this.state.selectedDate).format('DD-MM-YYYY');
    await this.props.getDiaryAnswers(userId, myDate);
    await this.props.getUser(userId);
    this.setState({ selectedUser: this.props.selectedUser });
    this.props.getAllDiaryDates(userId);
    if (this.props.allAnswers) {
      let newDiaryAnswers = [
        this.props.allAnswers.diary[0].ans1,
        this.props.allAnswers.diary[0].ans2,
        this.props.allAnswers.diary[0].ans3,
        this.props.allAnswers.diary[0].ans4,
        this.props.allAnswers.diary[0].ans5,
      ];
      this.setState({ diaryAnswers: newDiaryAnswers });
    } else {
      this.setState({ diaryAnswers: ['', '', '', '', ''] });
    }
  };
  handleDateChange = async (changedDate) => {
    this.setState({
      selectedDate: changedDate,
      formStarted: false,
      answeredQuestions: 0,
    });
    let myDate = moment(changedDate).format('DD-MM-YYYY');
    await this.props.getDiaryAnswers(this.state.selectedUser._id, myDate);
    if (this.props.allAnswers) {
      let newDiaryAnswers = [
        this.props.allAnswers.diary[0].ans1,
        this.props.allAnswers.diary[0].ans2,
        this.props.allAnswers.diary[0].ans3,
        this.props.allAnswers.diary[0].ans4,
        this.props.allAnswers.diary[0].ans5,
      ];
      this.setState({ diaryAnswers: newDiaryAnswers });
    } else {
      this.setState({ diaryAnswers: ['', '', '', '', ''] });
    }
  };

  increaseDateByOne = () => {
    let new_date = new Date(moment(this.state.selectedDate).add(1, 'days'));
    this.setState({ selectedDate: new_date });
  };
  decreaseDateByOne = () => {
    let new_date = new Date(
      moment(this.state.selectedDate).subtract(1, 'days')
    );
    this.setState({ selectedDate: new_date });
  };

  takeToNextStep = () => {
    if (this.state.diaryAnswers[this.state.answeredQuestions].length > 25) {
      this.setState({ answeredQuestions: this.state.answeredQuestions + 1 });
    } else {
      OCAlert.alertWarning('Cần viết ít nhất 50 kí tự để tiếp tục!', {
        timeOut: 3000,
      });
    }
  };

  finishQuestions = async () => {
    if (this.state.diaryAnswers[this.state.answeredQuestions].length < 50) {
      OCAlert.alertWarning('Cần viết ít nhất 50 kí tự để tiếp tục!', {
        timeOut: 3000,
      });
      return;
    }
    let myDate = moment(this.state.selectedDate).format('DD-MM-YYYY');
    let diaryObj = {
      day: myDate,
      ans1: this.state.diaryAnswers[0],
      ans2: this.state.diaryAnswers[1],
      ans3: this.state.diaryAnswers[2],
      ans4: this.state.diaryAnswers[3],
      ans5: this.state.diaryAnswers[4],
    };
    await this.props.saveDiaryAnswers(this.state.selectedUser._id, diaryObj);
    if (this.props.diarySaved) {
      OCAlert.alertSuccess('Hoàn tất nhật ký cảm xúc ngày hôm nay.', {
        timeOut: 3000,
      });
      this.changeSelectedUser(this.state.selectedUser._id);
      this.setState({ formStarted: false });
    } else {
      OCAlert.alertWarning('Oops! Mạng lỗi rồi nè!', {
        timeOut: 3000,
      });
    }
  };
  handleAnswerChange = (e) => {
    let updatedDiaryAnswers = this.state.diaryAnswers;
    updatedDiaryAnswers[this.state.answeredQuestions] = e.target.value;
    this.setState({
      diaryAnswers: updatedDiaryAnswers,
    });
  };
  getAnswersBox = () => {
    return (
      <div className='formBox'>
        <p className='diaryQuestion'>
          {this.state.diaryQuestions[this.state.answeredQuestions]}{' '}
        </p>
        <form className='answersForm mt-4'>
          {this.state.answeredQuestions === 0 ? (
            <div className='form-group'>
              <textarea
                className='form-control'
                name='question1'
                placeholder='Kích chuột vào đây để trả lời.'
                value={this.state.diaryAnswers[this.state.answeredQuestions]}
                onChange={(e) => this.handleAnswerChange(e)}
              />
            </div>
          ) : null}

          {this.state.answeredQuestions === 1 ? (
            <div className='form-group'>
              <textarea
                className='form-control'
                name='question2'
                placeholder='Kích chuột vào đây để trả lời.'
                value={this.state.diaryAnswers[this.state.answeredQuestions]}
                onChange={(e) => this.handleAnswerChange(e)}
              />
            </div>
          ) : null}
          {this.state.answeredQuestions === 2 ? (
            <div className='form-group'>
              <textarea
                className='form-control'
                name='question3'
                placeholder='Kích chuột vào đây để trả lời.'
                value={this.state.diaryAnswers[this.state.answeredQuestions]}
                onChange={(e) => this.handleAnswerChange(e)}
              />
            </div>
          ) : null}
          {this.state.answeredQuestions == 3 ? (
            <div className='form-group'>
              <textarea
                className='form-control'
                name='question4'
                placeholder='Kích chuột vào đây để trả lời.'
                value={this.state.diaryAnswers[this.state.answeredQuestions]}
                onChange={(e) => this.handleAnswerChange(e)}
              />
            </div>
          ) : null}
          {this.state.answeredQuestions == 4 ? (
            <div className='form-group'>
              <textarea
                className='form-control'
                name='question5'
                placeholder='Kích chuột vào đây để trả lời.'
                value={this.state.diaryAnswers[this.state.answeredQuestions]}
                onChange={(e) => this.handleAnswerChange(e)}
              />
            </div>
          ) : null}
        </form>
        <p className='form-text status'>
          {this.state.answeredQuestions + 1}/{this.state.totalDiaryQuestions}
        </p>
        {this.state.answeredQuestions > 0 ? (
          <>
            <button
              type='submit'
              className='btn startFormBtn mt-3 mr-2'
              onClick={() =>
                this.setState({
                  answeredQuestions: this.state.answeredQuestions - 1,
                })
              }
            >
              Quay Lại
            </button>{' '}
          </>
        ) : null}
        {this.state.answeredQuestions < 4 ? (
          <>
            <button
              type='submit'
              className='btn startFormBtn mt-3'
              onClick={this.takeToNextStep}
            >
              Tiếp
            </button>
          </>
        ) : (
          <>
            <button
              type='submit'
              className='btn startFormBtn mt-3'
              onClick={this.finishQuestions}
            >
              Hoàn Tất
            </button>
          </>
        )}
      </div>
    );
  };
  viewAnswersBox = () => {
    let allQues = [];
    this.state.diaryQuestions.map((ques, idx) => {
      allQues.push(
        <div className='formBox display'>
          <p className='diaryQuestion display'>
            {this.state.diaryQuestions[idx]}{' '}
          </p>
          <div className='answersForm display'>
            <p className='answers-para'>{this.state.diaryAnswers[idx]}</p>
          </div>
        </div>
      );
    });
    return (
      <div className='row'>
        <div className='col-sm-2'>
          <div className='profileImg display'>
            <img
              src={this.state.selectedUser.information.avatar}
              className='img img-responsive'
            ></img>
          </div>
        </div>
        <div className='col-sm-10'>
          <div className='allAnswers'>{allQues}</div>
        </div>
      </div>
    );
  };
  getFormBoxForMentalCalendar = () => {
    let todaysDate = new Date(
      moment().millisecond(0).seconds(0).second(0).minute(0).hour(0)
    );
    let selectedDate = new Date(
      moment(this.state.selectedDate)
        .millisecond(0)
        .seconds(0)
        .second(0)
        .minute(0)
        .hour(0)
    );

    let dateAfter7days = new Date(moment(todaysDate).add(7, 'days'));
    let dateBefore7Days = new Date(moment(todaysDate).subtract(7, 'days'));

    // let dayDiff = moment(dateAfter7days).diff(selectedDate,"days");
    // let hourDiff = moment(dateAfter7days).diff(selectedDate,"hours");
    // let minDiff = moment(dateAfter7days).diff(selectedDate,"minutes");
    // let secDiff = moment(dateAfter7days).diff(selectedDate,"seconds");
    // console.log(dayDiff, hourDiff, minDiff, secDiff)

    //isSelectedDateInPrev7Days : this is valid date in which users can edit

    let isSelectedDateInPrev7Days =
      moment(this.state.selectedDate).isAfter(dateBefore7Days) &&
      moment(this.state.selectedDate).isSameOrBefore(todaysDate, 'days');
    let isSelectedDateInNext7Days =
      moment(this.state.selectedDate).isBefore(dateAfter7days, 'days') &&
      moment(this.state.selectedDate).isAfter(todaysDate, 'days');
    let isSelectedDateAfter7Days = moment(
      this.state.selectedDate
    ).isSameOrAfter(dateAfter7days, 'days');
    if (this.props.allAnswers) {
      return this.viewAnswersBox();
    } else if (
      !this.props.allAnswers &&
      this.props.auth.user &&
      this.props.selectedUser &&
      this.props.selectedUser._id !== this.props.auth.user._id
    ) {
      return (
        <div className='formBox'>
          <p className='startFormMsg'>
            <span className='text-theme-orange'>
              {this.props.selectedUser.information.fullName}
            </span>{' '}
            vẫn chưa chia sẻ ghi chú cảm xúc của ngày này.
          </p>
        </div>
      );
    } else if (isSelectedDateInPrev7Days) {
      if (this.state.formStarted) {
        return this.getAnswersBox();
      } else {
        return (
          <div className='formBox'>
            <div className=''>
              <button
                className='btn startFormBtn'
                onClick={() => this.setState({ formStarted: true })}
              >
                Bắt Đầu
              </button>
            </div>
            <p className='startFormMsg'>
              Ghi chú cảm xúc này sẽ mở cho bạn điền đến lúc{' '}
              {moment(selectedDate)
                .add(7, 'days')
                .subtract(1, 'minutes')
                .format(DATE_FORMAT_WITH_TIME)}
              .
            </p>
            <p className='startFormMsg'>
              Khi quá ngày này, bạn sẽ không thể điền vào ghi chú này nữa.
            </p>
            {/* <p className="startFormMsg">
              There is {" "}
              {`${dayDiff} days, ${hourDiff} hours, ${minDiff} minutes, ${secDiff} seconds`}
              {" "} left
            </p> */}
          </div>
        );
      }
    } else if (isSelectedDateAfter7Days || isSelectedDateInNext7Days) {
      return (
        <div className='formBox'>
          <p className='startFormMsg'>Ghi chú chưa mở.</p>
          <p className='startFormMsg'>
            Quay lại lúc{' '}
            <span className='text-theme-orange font-weight-bold'>
              {moment(selectedDate).format(DATE_FORMAT_WITH_TIME)}
            </span>{' '}
            để điền ghi chú này. Ghi chú sẽ mở{' '}
            <span className='text-theme-orange font-weight-bold'>7 ngày</span>{' '}
            sau đó.
          </p>
        </div>
      );
    } else {
      return (
        <div className='formBox'>
          <p className='startFormMsg'>
            Ghi chú quá hạn. Bạn không thể điền ghi chú vào lúc này.
          </p>
        </div>
      );
    }
  };

  handleSelectedTabChange = (currentTab) => {
    this.setState({ selectedTab: currentTab });
  };
  render() {
    if (this.state.selectedUser) {
      return (
        <div className='MentalCalendar'>
          <div className='row customMargin p-3 questionsBox'>
            <div className='col-sm-4'>
              <MyCalendar
                selectedDate={this.state.selectedDate}
                handleDateChange={this.handleDateChange}
                allDates={this.props.allDates}
                allUsers={this.props.allUsers}
                selectedUserId={this.state.selectedUser._id}
                selectedUser={this.state.selectedUser}
                authUserId={
                  this.props.auth && this.props.auth.user
                    ? this.props.auth.user._id
                    : null
                }
                changeSelectedUser={this.changeSelectedUser}
                formStarted={this.state.formStarted}
              />
            </div>
            <div className='col-sm-8'>
              <div className='diary'>
                <p className='selected_date'>
                  <span onClick={this.decreaseDateByOne} className='arrow_btns'>
                    <i className='fa fa-chevron-left mr-3'></i>
                  </span>
                  {moment(this.state.selectedDate).format(DATE_FORMAT)}
                  <span onClick={this.increaseDateByOne} className='arrow_btns'>
                    <i className='fa fa-chevron-right ml-3'></i>
                  </span>
                </p>
                {this.getFormBoxForMentalCalendar()}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

MentalCalendar.propTypes = {
  loadUser: PropTypes.func,
  getDiaryAnswers: PropTypes.func,
  saveDiaryAnswers: PropTypes.func,
  getAllDiaryDates: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  allUsers: state.user.users ? state.user.users : null,
  selectedUser: state.user.user ? state.user.user : null,
  allAnswers: state.user.allAnswers ? state.user.allAnswers : null,
  diarySaved: state.user.diarySaved ? state.user.diarySaved : false,
  allDates: state.user.allDates ? state.user.allDates : null,
});

export default connect(mapStateToProps, {
  loadUser,
  getUser,
  getAllUsers,
  saveDiaryAnswers,
  getDiaryAnswers,
  getAllDiaryDates,
})(MentalCalendar);

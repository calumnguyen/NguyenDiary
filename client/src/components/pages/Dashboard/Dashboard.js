import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Redirect } from 'react-router-dom';

import './Dashboard.scss';
import MyCalendar from './MyCalendar';
import { loadUser, logout } from '../../../actions/auth';
import {
  getAllUsers,
  updateUserImage,
  saveDiaryAnswers,
  getDiaryAnswers,
  getAllDiaryDates,
  updateUser,
} from '../../../actions/user';

import MyLoader from '../../layout/MyLoader';
import { OCAlertsProvider } from '@opuscapita/react-alerts';
import { OCAlert } from '@opuscapita/react-alerts';
import Alert from '../../layout/Alert';

import Accounts from '../../Accounts';
import Header from '../../Header';
import UpdateInfo from '../../UpdateInfo';
import MentalCalendar from '../../MentalCalendar/MentalCalendar';

const DATE_FORMAT = 'DD/MM/YYYY';
const DATE_FORMAT_WITH_TIME = 'h:mm A DD/MM/YYYY';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      user: null,
      selectedTab: 'mentalcalendar',
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
      this.setState({ user: this.props.auth.user });
      this.props.getAllDiaryDates(this.props.auth.user._id);
    }
  }
  loadAndSetAuthUser = async () => {
    await this.props.loadUser();
    if (this.props.auth && this.props.auth.user) {
      this.setState({
        user: this.props.auth.user,
      });
    }
  };
  handleDateChange = async (changedDate) => {
    this.setState({
      selectedDate: changedDate,
      formStarted: false,
      answeredQuestions: 0,
    });
    let myDate = moment(changedDate).format('DD-MM-YYYY');
    await this.props.getDiaryAnswers(this.state.user._id, myDate);
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
    let myDate = moment(this.state.selectedDate).format('DD-MM-YYYY');
    let diaryObj = {
      day: myDate,
      ans1: this.state.diaryAnswers[0],
      ans2: this.state.diaryAnswers[1],
      ans3: this.state.diaryAnswers[2],
      ans4: this.state.diaryAnswers[3],
      ans5: this.state.diaryAnswers[4],
    };
    await this.props.saveDiaryAnswers(this.state.user._id, diaryObj);
    if (this.props.diarySaved) {
      OCAlert.alertSuccess('Hoàn tất nhật ký cảm xúc ngày hôm nay.', {
        timeOut: 3000,
      });
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
              Quay lại
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

    if (isSelectedDateInPrev7Days) {
      if (this.props.allAnswers || this.state.formStarted) {
        return this.getAnswersBox();
      } else {
        return (
          <div className='formBox'>
            <div className=''>
              <button
                className='btn startFormBtn'
                onClick={() => this.setState({ formStarted: true })}
              >
                Start Form
              </button>
            </div>
            <p className='startFormMsg'>
              You have time until{' '}
              {moment(selectedDate)
                .add(7, 'days')
                .subtract(1, 'minutes')
                .format(DATE_FORMAT_WITH_TIME)}
              .
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
          <p className='startFormMsg'>Nothing here yet! </p>
          <p className='startFormMsg'>
            Come back at{' '}
            <span className='text-theme-orange font-weight-bold'>
              {moment(selectedDate).format(DATE_FORMAT_WITH_TIME)}
            </span>{' '}
            to fill out! You will have{' '}
            <span className='text-theme-orange font-weight-bold'>7 days</span>{' '}
            after that.
          </p>
        </div>
      );
    } else {
      return (
        <div className='formBox'>
          <p className='startFormMsg'>You can't edit this now.</p>
        </div>
      );
    }
  };
  getMentalCalendar = () => {
    return (
      <div className='row customMargin p-3 questionsBox'>
        <div className='col-sm-4'>
          <MyCalendar
            selectedDate={this.state.selectedDate}
            handleDateChange={this.handleDateChange}
            allDates={this.props.allDates}
            allUsers={this.props.allUsers}
            authUserId={this.state.user._id}
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
    );
  };

  handleSelectedTabChange = (currentTab) => {
    this.setState({ selectedTab: currentTab });
  };
  render() {
    if (this.state.user) {
      return (
        <>
          <MyLoader />
          <Alert />
          <OCAlertsProvider />
          <section className='dashboard'>
            <div className='container'>
              <Header
                authUser={this.state.user}
                handleSelectedTabChange={this.handleSelectedTabChange}
                loadAndSetAuthUser={this.loadAndSetAuthUser}
              />
              {this.state.selectedTab === 'mentalcalendar' ? (
                <MentalCalendar />
              ) : null}
              {this.state.selectedTab === 'updateinfo' ? (
                <UpdateInfo
                  authUser={this.state.user}
                  loadAndSetAuthUser={this.loadAndSetAuthUser}
                />
              ) : null}
              {this.state.selectedTab === 'accounts' ? (
                <Accounts authUser={this.state.user} />
              ) : null}
            </div>
          </section>
        </>
      );
    } else {
      return <MyLoader />;
    }
  }
}

Dashboard.propTypes = {
  getAllUsers: PropTypes.func,
  logout: PropTypes.func,
  auth: PropTypes.object,
  loadUser: PropTypes.func,
  getDiaryAnswers: PropTypes.func,
  saveDiaryAnswers: PropTypes.func,
  getAllDiaryDates: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  userUpdated: state.user.saved ? state.user.saved : false,
  allUsers: state.user.users ? state.user.users : null,
  allAnswers: state.user.allAnswers ? state.user.allAnswers : null,
  diarySaved: state.user.diarySaved ? state.user.diarySaved : false,
  allDates: state.user.allDates ? state.user.allDates : null,
});

export default connect(mapStateToProps, {
  logout,
  loadUser,
  updateUserImage,
  getAllUsers,
  saveDiaryAnswers,
  getDiaryAnswers,
  getAllDiaryDates,
  updateUser,
})(Dashboard);

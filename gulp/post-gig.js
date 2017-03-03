const inquirer = require('inquirer');
const slug = require('slug')

const questions = [
  {
    type: 'input',
    name: 'title',
    message: 'What is the gigs title?'
  },
  {
    type: 'input',
    name: 'posterCompany',
    message: 'What is the name of the company posting the gig?'
  },
  {
    type: 'input',
    name: 'posterLink',
    message: 'What is link to the company\'s original gig posting?'
  },
  {
    type: 'input',
    name: 'location',
    message: 'What is gig located?'
  },
  {
    type: 'confirm',
    name: 'isRemote',
    default: false,
    message: 'Is this a remote gig or is remote an option?'
  },
  {
    type: 'editor',
    name: 'description',
    message: 'What is the gig description (hint: use rtf-to-markdown)?'
  },
  {
    type: 'input',
    name: 'howToApply',
    message: 'How do you apply to this job?'
  },
];

module.exports = () =>
  inquirer.prompt(questions)
  .then(answers => Object.assign(
    answers,
    {
      isActive: true,
      dateNotificationSent: false,
      datePosted: (new Date()).toISOString(),
    }
  ))
  .then(answers => {
    console.log('suggested url:', slug(`${answers.posterCompany} ${answers.title}`).toLowerCase());
    console.log('\n---\n');
    console.log(JSON.stringify(answers, null, 2));
    console.log('\n');
  });
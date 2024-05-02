import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectsShowCase extends Component {
  state = {
    activeId: categoriesList[0].id,
    data: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {activeId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeId}`

    const response = await fetch(url)
    const data = await response.json()

    if (response.ok) {
      const updateData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({data: updateData, apiStatus: apiStatusConstants.success})
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  changeSelector = event => {
    this.setState({activeId: event.target.value}, this.getData)
  }

  renderSuccessView = () => {
    const {data} = this.state

    return (
      <ul className="ul-card">
        {data.map(each => (
          <li className="li-card" key={each.id}>
            <img className="image" src={each.imageUrl} alt={each.name} />
            <p className="heading">{each.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderInProgressView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="card">
      <img
        className="image"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.Retry}>
        Retry
      </button>
    </div>
  )

  Retry = () => {
    this.getData()
  }

  renderPageView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderInProgressView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {actId} = this.state
    console.log(actId)
    return (
      <div className="app-container">
        <nav className="nav-container">
          <img
            className="nav-image"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <div className="list-container">
          <select
            className="select-class"
            onChange={this.changeSelector}
            value={actId}
          >
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderPageView()}
        </div>
      </div>
    )
  }
}

export default ProjectsShowCase

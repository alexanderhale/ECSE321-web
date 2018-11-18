import { baseUrl } from '../apiConfig';
import axios from 'axios';

export default {
	name: 'rankings',
	data() {
		return {
			selectedCategory: '',
			journeys: []
		}
	},
	methods: {
		setCategory(val) {
			this.selectedCategory = val
		} 
	},
	mounted () {
		axios.get(`${baseUrl}/journey/all`, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(res => this.journeys = res.data)
			.catch(err => console.error(err))
	  }
}
import React from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from '../components/ListingItem';




function Profile() {
  const auth = getAuth()

  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)

  const [changeDetails, setChangeDetails] = useState(false)

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })

  const { name, email } = formData

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings')

      const q = query(listingsRef, where("userRef", "==", auth.currentUser.uid), orderBy("timeStamp", "desc"))

      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })

      setListings(listings)
      setLoading(false)
    }
    fetchUserListings()
  }, [auth.currentUser.uid])

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // update display name
        await updateProfile(auth.currentUser, {
          displayName: name
        })
        // update in firestore
        const userRaf = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRaf, {
          name
        })
      }

    } catch (error) {
      toast.error('Could not update user info')
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const onDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, 'listings', listingId));
      const updatedListings = listings.filter((listing) => listing.id !== listingId
      )
      setListings(updatedListings)
      toast.success("Successfully deleted listings")
    }
  }

  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

  return (
    <>
      <div className="profile">
        <header className="profileHeade">
          <p className="pageHeader">My Profile</p>
          <button className="logOut" type="button" onClick={onLogout}>Logout</button>
        </header>

        <main>
          <div className="profileDetailsHeader">
            <p className="profileDetailsText">Personal details</p>
            <p className="changePersonalDetails" onClick={() => {
              changeDetails && onSubmit()
              setChangeDetails((prevState) => !prevState)
            }}>{changeDetails ? 'done' : 'change'} </p>
          </div>

          <div className="profileCard">
            <form>
              <input type="text" id="name" className={!changeDetails ? 'profileName' : 'profileNameActive'} disabled={!changeDetails} value={name} onChange={onChange} />

              <input type="email" id="email" className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} disabled={!changeDetails} value={email} onChange={onChange} />

            </form>
          </div>

          <Link to='/create-listing' className='createListing'>
            <img src={homeIcon} alt="home" />
            <p>Sell or rent yout home</p>
            <img src={arrowRight} alt="arrow right" />
          </Link>

          {!loading && listings?.length > 0 && (
            <>
              <p className="listingText">Your Listings</p>
              <ul className="listingsList">
                {listings.map((listing) => (
                  <ListingItem key={listing.id} listing={listing.data} id={listing.id}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)} />
                ))}
              </ul>
            </>
          )}

        </main>
      </div>


    </>
  )
}

export default Profile
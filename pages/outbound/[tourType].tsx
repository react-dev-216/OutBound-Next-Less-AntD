import { Button, Icon, Input, Select, Spin, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { Cart, TcResponse, TravelCloudClient } from "travelcloud-antd";
import { useRouter } from 'next/router'

const config = {
  tcUser: 'edge2',
  defaultTitle: '',
  companyName: ''
}

const OutBoundPage = ({ tourType } : {tourType: string}) => {
  const defaultRoom = {
    roomNo: 1,
    adults: 1,
    children: 0,
    childrenNoBed: 0,
    infants: 0,
  };

  const router = useRouter()
  const [priceCheckRes, setPriceCheckRes] = useState<TcResponse<any>>({})
  const [tourReq, setTourReq] = useState<TcResponse<any>>({loading: true})
  const client = new TravelCloudClient(config)

  useEffect(() => {
    async function asyncUseEffect() {
      if (tourType != null && tourType.match(/^[A-Z]+$/) != null && tourType.length > 3 && tourType.length < 10) {
        var req = await client.outboundGet('tourmasters/searchtourtype', {q: tourType})
        setTourReq(req)
      }
    }
    asyncUseEffect()
  }, [tourType])

  const cart = process.browser === false ? null : new Cart({
    client,
    onOrderChange: () => { },
    onCustomerChange: () => { },
  })

  const tour = tourReq?.result?.[0]
  const tourMaster = tour?.tourMasters?.[0]

  const bookingJsx = tourMaster != null &&
    <>
      <h1>{tour.briefDescription}</h1>
      <h2>Select Departure Date</h2>
      <table>
        <tbody>
          <tr>
            <th>Tour Code</th>
            <th>Departure Date</th>
            <th>Return Date</th>
            <th></th>
          </tr>
          {tour.tourMasters.map((tm) => <tr>
            <td>{tm.tourCode}</td>
            <td>{tm.departureDate}</td>
            <td>{tm.returnDate}</td>
            <td><Button>Select departure</Button></td>
          </tr>)}
        </tbody>
      </table>

      <h2>Tour Master</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Single</th>
            <th>Twin</th>
            <th>Triple</th>
            <th>Quad</th>
            <th>Child Without Bed</th>
            <th>Child Half Twin</th>
            <th>Child With Bed</th>
            <th>Infant</th>
          </tr>
          <tr>
            <th>Package</th>
            <td>{tourMaster.singleFare}</td>
            <td>{tourMaster.twinFare}</td>
            <td>{tourMaster.tripleFare}</td>
            <td>{tourMaster.quadFare}</td>
            <td>{tourMaster.childWithoutBedFare}</td>
            <td>{tourMaster.childHalfTwinFare}</td>
            <td>{tourMaster.childWithBedFare}</td>
            <td>{tourMaster.infantFare}</td>
          </tr>
          <tr>
            <th>Ground</th>
            <td>{tourMaster.groundSingleFare}</td>
            <td>{tourMaster.groundTwinFare}</td>
            <td>{tourMaster.groundTripleFare}</td>
            <td>{tourMaster.groundQuadFare}</td>
            <td>{tourMaster.groundChildWithoutBedFare}</td>
            <td>{tourMaster.groundChildHalfTwinFare}</td>
            <td>{tourMaster.groundChildWithBedFare}</td>
            <td>{tourMaster.groundInfantFare}</td>
          </tr>
        </tbody>
      </table>

      <Button onClick={async () => {
        setPriceCheckRes({ loading: true })

        const priceCheckRes = await client.outboundPost('tourbookings/pricecheck', {}, {
          tourCode: tourMaster.tourCode,
          landOnly: 'Y',
          roomList: [defaultRoom]
        });
        setPriceCheckRes(priceCheckRes)
        
      }} loading={priceCheckRes.loading === true}>Price Check</Button>

      <h2>Price Check</h2>
      <pre>{JSON.stringify(priceCheckRes, null, 2)}</pre>

      {priceCheckRes.result != null && <Button onClick={async () => {
        cart.reset().addOutboundTour(
          {
            tourMaster,
            priceCheck: priceCheckRes.result
          }, {
            tourCode: tourMaster.tourCode,
            landOnly: 'Y',
            roomList: [defaultRoom]
        })
        router.push("/checkout")
      }}>Checkout</Button>}
    </>

  return <div style={{ margin: "32px" }}>
    {tourReq.loading && <Spin size="large" style={{margin: 'auto'}} />}
    {bookingJsx}
  </div>
};

export default OutBoundPage;

export async function getStaticProps(context) {
  var tourType = context.params?.tourType
  return {
    props: { tourType }, // will be passed to the page component as props
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

"use client";
import { useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@apollo/client";
import {
  PAYMENT_ORDER_CREATION,
  PAYMENT_VERIFICATION,
} from "@/graphql/queries/main.mutations";

function Payment() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("0");
  const [currency, setCurrency] = useState("INR");
  const [loading, setLoading] = useState(false);
  const [createOrder] = useMutation(PAYMENT_ORDER_CREATION);
  const [paymentVerification] = useMutation(PAYMENT_VERIFICATION);

  const createOrderId = async () => {
    try {
      const { data: response, errors } = await createOrder({
        variables: {
          orderInput: {
            remark: "test1",
            amount: parseFloat(amount),
          },
        },
      });
      //   const response = await fetch("/api/order", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       amount: parseFloat(amount) * 100,
      //     }),
      //   });

      if (errors) {
        throw new Error("Network response was not ok");
      }

      const data = await response.Payment_gateway_Order_Create;
      console.log({ data });
      return data.order_id;
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };
  const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const orderId: string = await createOrderId();
      console.log({ orderId });
      const options = {
        key: "rzp_test_UhZKmvjqgzuuMK",
        amount: parseFloat(amount) * 100,
        currency: currency,
        name: name,
        description: "description",
        order_id: orderId,
        // callback_url: "http://localhost:3000/dashboard",
        // redirect: true,
        handler: async function (response: any) {
          console.log({ response });
          const { data: result, errors } = await paymentVerification({
            variables: {
              verifyPaymentGatewayInput: {
                order_uuid: orderId,
                razorPay_orderId: response.razorpay_order_id,
                razorPay_paymentId: response.razorpay_payment_id,
                razorPay_signature: response.razorpay_signature,
              },
            },
          });
          const res = await result.Verify_Payment_Gateway_Order;
          if (errors) alert("payment succeed");
          else {
            alert(res.message);
          }
        },
        prefill: {
          name: name,
          email: email,
        },
        theme: {
          color: "#3399cc",
        },
      };
      //   @ts-ignore
      const paymentObject = new Razorpay(options) as any;
      paymentObject.open();
      paymentObject.on("payment.failed", function (response: any) {
        alert(response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <section className="mx-5 flex h-14 min-h-[94vh] flex-col items-center gap-6 pt-36 sm:mx-10 2xl:mx-auto 2xl:w-[1400px] ">
        <form
          className="flex w-full flex-col gap-6 sm:w-80"
          onSubmit={processPayment}
        >
          <div className="space-y-1">
            <Label>Full name</Label>
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="user@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Amount</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="1"
                min={5}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit">Pay</Button>
        </form>
      </section>
    </>
  );
}

export default Payment;

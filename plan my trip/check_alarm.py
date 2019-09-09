import json
import boto3
from pprint import pprint
from datetime import datetime

def datetime_handler(x, y):
	if isinstance(y, datetime):
		return y.isoformat()
	raise TypeError("Unknown type")

def alarm_handler(event, context):
	pprint("Received the message and start to check alarm state..........")
	json.JSONEncoder.default = datetime_handler
	cw = boto3.client('cloudwatch')
	response = cw.describe_alarms(AlarmNames=['cw_alarm'])
	message = response["MetricAlarms"][0]
	pprint("Alarm state is " + message["StateValue"])
	if message["StateValue"]=="ALARM":
		sns = boto3.client('sns')
		responseSNS = sns.publish(TopicArn='arn:aws:sns::aaaaaaaaa:alarm_topic', Message=json.dumps(message), Subject='Notification from cw_alarm')
		pprint("Send SNS notification!")
		return("Alarm!")
	else:
		pprint("No alarm!")
		return("No alarm!")
